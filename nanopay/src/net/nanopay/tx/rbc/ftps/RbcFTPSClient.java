package net.nanopay.tx.rbc.ftps;

import foam.core.X;
import foam.nanos.logger.Logger;
import foam.nanos.logger.PrefixLogger;
import org.apache.commons.beanutils.MethodUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPSClient;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class RbcFTPSClient {

  X x;
  Logger logger;
  FTPSClient ftpsClient;
  RbcFTPSCredential credential;

  public static final String PGP_FOLDER = "outbound/3EPK/";
  public static final String PAIN_FOLDER = "outbound/XG02/";

  public static final String DOWNLOAD_FOLDER = System.getProperty("NANOPAY_HOME") + "/var" + "/rbc_eft/";


  /**
   * Send the file to RBC home folder
   */
  public void send(File file) throws IOException {
    if ( (! this.credential.getEnable() ) || this.credential.getSkipSendFile() ) {
      return;
    }

    this.login();

    this.logger.info("Start sending file: " + file.getName());
    this.put(file.getAbsolutePath(), file.getName());
    this.logger.info("Finish sending file: " + file.getName());

    this.logout();
  }

  /**
   * Download the file from RBC outbound folder
   */
  public List<File> download(String folder) throws IOException {
    if ( ! this.credential.getEnable() ) {
      return new ArrayList<>();
    }

    List<File> downloadFile = new ArrayList<>();
    this.login();

    this.logger.info("Start downloading. Listing all the files.");
    FTPFile[] ftpFiles = this.ls(folder);

    for (FTPFile ftpFile : ftpFiles) {
      if ( ftpFile.getName().contains("downloaded%FTPS") || ftpFile.getName().contains(".cp")  ) {
        continue;
      }

      this.logger.info("Start downloading file: " + ftpFile.getName());
      downloadFile.add(
        this.get(folder + ftpFile.getName(), DOWNLOAD_FOLDER + ftpFile.getName())
      );
      this.logger.info("Finish downloading file: " + ftpFile.getName());
    }

    this.logout();
    this.logger.info("Finish downloading all the files");
    return downloadFile;
  }

  public RbcFTPSClient(X x) {
    this.init(x, null);
  }

  public RbcFTPSClient(X x, FTPSClient ftpsClient) {
    this.init(x, ftpsClient);
  }

  private void init(X x, FTPSClient ftpsClient) {
    this.x = x;
    this.ftpsClient = ftpsClient == null ? new FTPSClient("TLS", false) : ftpsClient;
    this.logger = new PrefixLogger(new String[] {"RBC"}, (Logger) x.get("logger"));
    this.credential = (RbcFTPSCredential) this.x.get("rbcFTPSCredential");
  }

  public boolean login() throws IOException {

    this.ftpsClient.connect(credential.getHost());
    this.logger.info("Connect : " + this.ftpsClient.getReplyString());

    boolean result = this.ftpsClient.login(credential.getUsername(), credential.getPassword());
    this.logger.info("Login : " + this.ftpsClient.getReplyString());

    ftpsClient.enterLocalPassiveMode();

    ftpsClient.execPBSZ(0);
    this.logger.info("PBSZ : " + this.ftpsClient.getReplyString());

    ftpsClient.execPROT("P");
    this.logger.info("PROT : " + this.ftpsClient.getReplyString());

    ftpsClient.setFileType(FTP.BINARY_FILE_TYPE);
    this.logger.info("File type : " + this.ftpsClient.getReplyString());

    return result;
  }

  public void put(String local, String remote) throws IOException {
    ftpsClient.storeFile(remote, new FileInputStream(new File(local)));
    this.logger.info(this.ftpsClient.getReplyString());
  }

  public File get(String remote, String local) throws IOException {
    File tmpFile = new File(local);
    FileUtils.touch(tmpFile);

    FileOutputStream fileOutputStream = new FileOutputStream(tmpFile);

    ftpsClient.retrieveFile(remote, fileOutputStream);
    this.logger.info("Retrieve File : " + this.ftpsClient.getReplyString());

    return tmpFile;
  }

  public FTPFile[] ls(String path) throws IOException {
    FTPFile[] ftpFiles = this.ftpsClient.listFiles(path);
    this.logger.info("List Files : " + this.ftpsClient.getReplyString());

    return ftpFiles;
  }

  public String pwd() throws IOException {
    String result = this.ftpsClient.printWorkingDirectory();
    this.logger.info("FTPs Reply String: " + this.ftpsClient.getReplyString());

    return result;
  }

  public void logout() throws IOException {
    this.ftpsClient.logout();
    this.ftpsClient.disconnect();
  }

}

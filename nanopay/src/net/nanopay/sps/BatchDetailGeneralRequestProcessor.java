package net.nanopay.sps;

import foam.core.ContextAgent;
import foam.core.X;
import foam.nanos.logger.Logger;
import net.nanopay.sps.model.*;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class BatchDetailGeneralRequestProcessor {

  public void execute() {
    //Logger logger = (Logger) x.get("logger");

    String testData = "20<FS>2030<FS>60<FS>20180704115959<FS>ZYX80<FS><FS><FS><FS><FS><FS><FS><FS><FS>5<FS>0<FS><FS>";

    BatchDetailRequestPacket batchDetailRequestPacket = new BatchDetailRequestPacket();
    BatchDetailGeneralResponse batchDetailGeneralResponse = new BatchDetailGeneralResponse();

    batchDetailRequestPacket.setMsgNum(20);
    batchDetailRequestPacket.setPacketNum(2030);
    batchDetailRequestPacket.setMessageModifierCode(60);
    batchDetailRequestPacket.setLocalTransactionTime("20180704115959");
    batchDetailRequestPacket.setTID("ZYX80");

    batchDetailRequestPacket.setOptionallyEnteredDate("");
    batchDetailRequestPacket.setCheckApprovalCount("");
    batchDetailRequestPacket.setCheckApprovalAmount("");
    batchDetailRequestPacket.setDeclineCount("");
    batchDetailRequestPacket.setDeclineAmount("");
    batchDetailRequestPacket.setVoidCount("");
    batchDetailRequestPacket.setVoidAmount("");
    batchDetailRequestPacket.setMaxDetailItemsPerTransmission("5");
    batchDetailRequestPacket.setSyncCounter("0");
    batchDetailRequestPacket.setCreditCount("");
    batchDetailRequestPacket.setCreditAmount("");


    String generatedData = batchDetailRequestPacket.toSPSString();


    System.out.println(generatedData);
    if (generatedData.equals(testData)) {
      System.out.println("right");
    }



    try {
      String url = "https://spaysys.com/cgi-bin/cgiwrap-noauth/dl4ub/tinqpstpbf.cgi";

      HttpClient client = new DefaultHttpClient();
      HttpPost post = new HttpPost(url);

      List<NameValuePair> urlParameters = new ArrayList<>();
      urlParameters.add(new BasicNameValuePair("packet", generatedData));
      post.setEntity(new UrlEncodedFormEntity(urlParameters));

      HttpResponse httpResponse = client.execute(post);

      System.out.println("Sending 'POST' request to URL : " + url);
      System.out.println("Post parameters : " + post.getEntity());
      System.out.println("Response Code : " +
        httpResponse.getStatusLine().getStatusCode());

      BufferedReader rd = new BufferedReader(
        new InputStreamReader(httpResponse.getEntity().getContent()));

      StringBuilder sb = new StringBuilder();
      String line;
      while ((line = rd.readLine()) != null) {
        sb.append(line);
      }

      String response = sb.toString();
      System.out.println(response);

      batchDetailGeneralResponse.parseSPSResponse(response);
      System.out.println("after parse");
      System.out.println(batchDetailGeneralResponse);


    } catch (IOException | IllegalAccessException | InstantiationException e) {
      e.printStackTrace();
    }


  }
}

foam.CLASS({
  package: 'net.nanopay.security',
  name: 'AbstractFileKeyStoreManager',
  extends: 'net.nanopay.security.AbstractKeyStoreManager',
  abstract: true,

  documentation: 'Abstract KeyStoreManager that uses a file to store keys.',

  javaImports: [
    'foam.util.SafetyUtil',

    'java.io.*',
    'java.nio.charset.StandardCharsets',
    'java.security.KeyStore'
  ],

  properties: [
    {
      class: 'String',
      name: 'type',
      documentation: 'KeyStore type.'
    },
    {
      class: 'String',
      name: 'provider',
      documentation: 'KeyStore crypto provider.'
    },
    {
      class: 'String',
      name: 'keyStorePath',
      documentation: 'Path to keystore file.'
    },
    {
      class: 'String',
      name: 'passphrasePath',
      documentation: 'Path to passphrase file.'
    },
    {
      class: 'Object',
      name: 'keyStoreFile',
      transient: true,
      documentation: 'KeyStore file.',
      javaType: 'java.io.File',
      javaFactory: `
        return new File(getKeyStorePath()).getAbsoluteFile();
      `
    },
    {
      class: 'Object',
      name: 'passphraseFile',
      transient: true,
      documentation: 'Passphrase file',
      javaType: 'java.io.File',
      javaFactory: `
        return new File(getPassphrasePath()).getAbsoluteFile();
      `
    },
    {
      class: 'Object',
      name: 'keyStore',
      transient: true,
      documentation: 'Keystore file where all of the keys are stored.',
      javaType: 'java.security.KeyStore',
      javaFactory: `
        try {
          KeyStore keyStore = ! SafetyUtil.isEmpty(getProvider()) ?
            KeyStore.getInstance(getType(), getProvider()) :
            KeyStore.getInstance(getType());

          // check for keystore and passphrase file
          File keyStoreFile = getKeyStoreFile();
          char[] passphrase = getPassphrase();

          // load keystore file using password
          try ( FileInputStream fis = new FileInputStream(keyStoreFile) ) {
            keyStore.load(fis, passphrase);
          }

          return keyStore;
        } catch (Throwable t) {
          throw new RuntimeException(t);
        }
      `
    },
    {
      class: 'Object',
      name: 'passphrase',
      transient: true,
      documentation: 'Passphrase used to load KeyStore',
      javaType: 'char[]',
      javaFactory: `
        try {
        char[] cbuffer = new char[32];
        File passphraseFile = getPassphraseFile();

        try ( BufferedReader reader = new BufferedReader(new InputStreamReader(
          new FileInputStream(passphraseFile), StandardCharsets.UTF_8)) ) {
          reader.read(cbuffer, 0, 32);
        }

        return cbuffer;
        } catch ( Throwable t ) {
          throw new RuntimeException(t);
        }
      `
    }
  ],

  methods: [
    {
      name: 'storeKey',
      synchronized: true,
      javaCode: `
        try {
          // store key using keystore passphrase because keystore doesn't
          // allow you to store secret key entry without a passphrase
          getKeyStore().setEntry(alias, entry, new KeyStore.PasswordProtection(getPassphrase()));

          // save keystore
          try (FileOutputStream fos = new FileOutputStream(getKeyStoreFile())) {
            getKeyStore().store(fos, getPassphrase());
          }
        } catch (Throwable t) {
          throw new RuntimeException(t);
        }
      `
    }
  ]
});

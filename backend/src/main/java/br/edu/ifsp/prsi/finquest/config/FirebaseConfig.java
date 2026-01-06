package br.edu.ifsp.prsi.finquest.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Profile("!test")
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            String firebaseCredentials = System.getenv("FIREBASE_CREDENTIALS");
            
            InputStream serviceAccount;

            if (firebaseCredentials != null && !firebaseCredentials.isEmpty()) {
                serviceAccount = new ByteArrayInputStream(firebaseCredentials.getBytes());
            } else {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");
                if (serviceAccount == null) {
                   throw new IOException("Arquivo serviceAccountKey.json não encontrado nem variável FIREBASE_CREDENTIALS definida.");
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    @DependsOn("firebaseApp")
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }
}
package br.edu.ifsp.prsi.finquest.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
@Profile("!test")
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        ClassPathResource serviceAccountResource = new ClassPathResource("finquest-65954-firebase-adminsdk-fbsvc-33095347ec.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountResource.getInputStream()))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        } else {
            return FirebaseApp.getInstance();
        }
    }

    @Bean
    @DependsOn("initializeFirebase")
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }
}

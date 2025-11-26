package br.edu.ifsp.prsi.finquest.security;

import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Profile("!test")
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public FirebaseTokenFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        FirebaseToken decodedToken;

        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token inválido.\"}");
            return;
        }

        String uid = decodedToken.getUid();

        List<GrantedAuthority> authorities = new ArrayList<>();

        try {
            Optional<br.edu.ifsp.prsi.finquest.model.User> userOpt = userRepository.findById(uid);
            if (userOpt.isPresent()) {
                br.edu.ifsp.prsi.finquest.model.User user = userOpt.get();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
        } catch (Exception e) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(uid)
                .password("")
                .authorities(authorities)
                .build();

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}

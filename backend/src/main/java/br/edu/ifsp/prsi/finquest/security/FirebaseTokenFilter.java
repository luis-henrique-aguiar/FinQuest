package br.edu.ifsp.prsi.finquest.security;

import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC; // Importante para o contexto
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Profile("!test")
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseTokenFilter.class);
    private final UserRepository userRepository;

    public FirebaseTokenFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.debug("Acesso anônimo (sem token) para: {} {}", request.getMethod(), path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        FirebaseToken decodedToken;

        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        } catch (Exception e) {
            logger.warn("Falha na autenticação (Token Inválido) para {}: {}", path, e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token inválido ou expirado.\"}");
            return;
        }

        String uid = decodedToken.getUid();
        MDC.put("userId", uid);

        List<GrantedAuthority> authorities = new ArrayList<>();
        try {
            Optional<br.edu.ifsp.prsi.finquest.model.User> userOpt = userRepository.findById(uid);

            if (userOpt.isPresent()) {
                br.edu.ifsp.prsi.finquest.model.User user = userOpt.get();
                String role = "ROLE_" + user.getRole().name();
                authorities.add(new SimpleGrantedAuthority(role));

                logger.debug("Autenticação Sucesso: UID={}, Role={}, Path={}", uid, role, path);
            } else {
                logger.error("INCONSISTÊNCIA: Usuário autenticado no Firebase mas NÃO ENCONTRADO no banco local! UID={}", uid);
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
        } catch (Exception e) {
            logger.error("Erro ao buscar permissões do usuário {}: {}", uid, e.getMessage());
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

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("userId");
        }
    }
}
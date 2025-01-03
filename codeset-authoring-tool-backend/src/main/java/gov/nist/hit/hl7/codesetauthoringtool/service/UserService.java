package gov.nist.hit.hl7.codesetauthoringtool.service;

import gov.nist.hit.hl7.codesetauthoringtool.model.ApplicationUser;
import gov.nist.hit.hl7.codesetauthoringtool.model.request.AuthUser;
import gov.nist.hit.hl7.codesetauthoringtool.model.request.JwtRequest;
import gov.nist.hit.hl7.codesetauthoringtool.model.request.NewUserRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;
import java.util.List;

public interface UserService {
    public List<ApplicationUser> getUsers() throws IOException;
    public ApplicationUser createUser(NewUserRequest newUser) throws IOException;
    public void deleteUser(String id) throws IOException;


}

package gov.nist.hit.hl7.codesetauthoringtool.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "codeset-versions")
public class CodesetVersion {

    @Id
    private String id;
    private String version;
    private Boolean exposed;
    private Date dateCreated;
    private String status;

    @OneToMany(mappedBy = "codesetVersion")
    @JsonBackReference
    private List<Code> codes;

    @ManyToOne
    @JsonIgnore
    private Codeset codeset;

    public CodesetVersion(){

    }

    public CodesetVersion(String version, Boolean exposed, Date dateCreated, String status, List<Code> codes, Codeset codeset) {
        this.version = version;
        this.exposed = exposed;
        this.dateCreated = dateCreated;
        this.status = status;
        this.codes = codes;
        this.codeset = codeset;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Boolean getExposed() {
        return exposed;
    }

    public void setExposed(Boolean aExposed) {
        exposed = aExposed;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Code> getCodes() {
        return codes;
    }

    public void setCodes(List<Code> codes) {
        this.codes = codes;
    }

    public Codeset getCodeset() {
        return codeset;
    }

    public void setCodeset(Codeset codeset) {
        this.codeset = codeset;
    }

    @PrePersist
    public void generateId() {
        // This will generate a UUID and remove hyphens to get a 32-character string
        this.id = UUID.randomUUID().toString().replace("-", "");
    }
}
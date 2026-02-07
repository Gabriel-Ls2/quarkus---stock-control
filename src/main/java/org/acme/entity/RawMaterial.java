package org.acme.entity;

import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
public class RawMaterial extends PanacheEntity {

    public String code;
    public String name;
    public Integer stockQuantity;

}

package org.acme.entity;

import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
public class Product extends PanacheEntity {

    public String code;
    public String name;
    public Double price;

}

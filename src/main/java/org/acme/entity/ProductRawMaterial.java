package org.acme.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
public class ProductRawMaterial extends PanacheEntity {

    @ManyToOne
    public Product product;

    @ManyToOne
    public RawMaterial rawMaterial;

    public Integer requiredQuantity;

}

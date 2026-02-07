package org.acme.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

import org.acme.entity.Product;
import org.acme.entity.RawMaterial;
import org.acme.entity.ProductRawMaterial;

@Path("/product-raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRawMaterialResource {

    @GET
    public List<ProductRawMaterial> list() {
        return ProductRawMaterial.listAll();
    }

    @POST
    @Transactional
    public ProductRawMaterial create(ProductRawMaterial prm) {
        Product product = Product.findById(prm.product.id);
        RawMaterial rawMaterial = RawMaterial.findById(prm.rawMaterial.id);

        prm.product = product;
        prm.rawMaterial = rawMaterial;

        prm.persist();
        return prm;
    }
}

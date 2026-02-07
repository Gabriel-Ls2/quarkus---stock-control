package org.acme.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

import org.acme.entity.Product;

import org.acme.entity.RawMaterial;
import org.acme.entity.ProductRawMaterial;
import org.acme.dto.AddRawMaterialRequest;
import jakarta.ws.rs.core.Response;


@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> list() {
        return Product.listAll();
    }

    @GET
    @Path("/{id}")
    public Product findById(@PathParam("id") Long id) {
        Product product = Product.findById(id);

        if (product == null) {
            throw new NotFoundException("Product not found");
        }

        return product;
    }

    @POST
    @Transactional
    public Product create(Product product) {
        product.persist();
        return product;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, Product data) {
        Product product = Product.findById(id);

        if (product == null) {
            throw new NotFoundException("Product not found");
        }

        product.code = data.code;
        product.name = data.name;
        product.price = data.price;

        return product;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product.deleteById(id);
    }

    @POST
    @Path("/{id}/materials")
    @Transactional
    public Response addRawMaterial(
            @PathParam("id") Long productId,
            AddRawMaterialRequest request
    ) {
        Product product = Product.findById(productId);
        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        RawMaterial rawMaterial = RawMaterial.findById(request.rawMaterialId);
        if (rawMaterial == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        ProductRawMaterial exists = ProductRawMaterial.find(
                "product.id = ?1 and rawMaterial.id = ?2",
                productId,
                request.rawMaterialId
        ).firstResult();

        if (exists != null) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Raw material already associated")
                    .build();
        }

        ProductRawMaterial prm = new ProductRawMaterial();
        prm.product = product;
        prm.rawMaterial = rawMaterial;
        prm.requiredQuantity = request.requiredQuantity;
        prm.persist();

        return Response.status(Response.Status.CREATED).entity(prm).build();
    }
    @GET
    @Path("/{id}/materials")
    public List<ProductRawMaterial> listMaterials(@PathParam("id") Long productId) {

        Product product = Product.findById(productId);
        if (product == null) {
            throw new NotFoundException("Product not found");
        }

        return ProductRawMaterial.list("product.id", productId);
    }
}



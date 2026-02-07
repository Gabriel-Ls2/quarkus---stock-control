package org.acme.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

import org.acme.entity.RawMaterial;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public RawMaterial create(RawMaterial rm) {
        rm.persist();
        return rm;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial data) {
        RawMaterial rm = RawMaterial.findById(id);

        rm.code = data.code;
        rm.name = data.name;
        rm.stockQuantity = data.stockQuantity;

        return rm;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        RawMaterial.deleteById(id);
    }
}

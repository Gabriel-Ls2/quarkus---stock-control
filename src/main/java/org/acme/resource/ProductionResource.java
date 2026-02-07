package org.acme.resource;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.util.*;

import org.acme.dto.ProductionSuggestionDTO;
import org.acme.entity.Product;
import org.acme.entity.ProductRawMaterial;
import org.acme.entity.RawMaterial;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {
@GET
@Path("/suggestion")
public Map<String, Object> getProductionSuggestion() {

    //copiar o estoque atual (em memória)
    Map<Long, Integer> stock = new HashMap<>();
    List<RawMaterial> materials = RawMaterial.listAll();

    for (RawMaterial rm : materials) {
        stock.put(rm.id, rm.stockQuantity);
    }

    //buscar produtos por maior valor
    List<Product> products =
            Product.list("order by price desc");

    List<ProductionSuggestionDTO> suggestions = new ArrayList<>();
    BigDecimal totalProductionValue = BigDecimal.ZERO;

    //processar produto por produto
    for (Product product : products) {

        List<ProductRawMaterial> relations =
                ProductRawMaterial.list("product.id", product.id);

        if (relations.isEmpty()) continue;

        int maxQuantity = Integer.MAX_VALUE;

        //calcular quanto dá pra produzir
        for (ProductRawMaterial prm : relations) {
            int available = stock.getOrDefault(
                    prm.rawMaterial.id, 0
            );

            int possible =
                    available / prm.requiredQuantity;

            maxQuantity = Math.min(maxQuantity, possible);
        }

        if (maxQuantity <= 0) continue;

        //debitar estoque (simulado)
        for (ProductRawMaterial prm : relations) {
            Long rmId = prm.rawMaterial.id;
            stock.put(
                    rmId,
                    stock.get(rmId) - (prm.requiredQuantity * maxQuantity)
            );
        }

        //montar resposta
        ProductionSuggestionDTO dto = new ProductionSuggestionDTO();
        dto.productId = product.id;
        dto.productName = product.name;
        dto.quantity = maxQuantity;

        BigDecimal unitPrice = BigDecimal.valueOf(product.price);
        dto.unitPrice = unitPrice;

        dto.totalValue = unitPrice.multiply(
                BigDecimal.valueOf(maxQuantity)
        );

        totalProductionValue = totalProductionValue.add(dto.totalValue);
        suggestions.add(dto);

    }

    //retorno final
    Map<String, Object> response = new HashMap<>();
    response.put("products", suggestions);
    response.put("totalValue", totalProductionValue);

    return response;
}
}
import React from "react";

const CardV0 = () => {
  return <></>;
  /* return (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <img
            src={item.productImage || "/placeholder.svg"}
            alt={item.productName}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {item.productName}
            </CardTitle>
            <Badge variant="outline" className="mt-1">
              {item.category}
            </Badge>
          </div>
          <Badge variant={item.status === "active" ? "default" : "secondary"}>
            {item.status === "active" ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-green-600">
          ${item.price.toLocaleString()}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            {item.store}
          </div>
          <div className="flex items-center">
            <Warehouse className="h-4 w-4 mr-2" />
            {item.warehouse}
          </div>
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            {item.totalQuantity} unidades totales
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            {item.averageRating} ({item.reviews} reseñas)
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Variantes:</div>
          {item.variants.slice(0, 2).map((variant) => (
            <div key={variant.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{variant.name}</span>
              <span className="font-medium">{variant.quantity} unidades</span>
            </div>
          ))}
          {item.variants.length > 2 && (
            <div className="text-sm text-blue-600">
              +{item.variants.length - 2} variantes más
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => setSelectedItem(item)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => {
              setEditingItem(item);
              setCurrentView("edit");
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  ); */
};

export default CardV0;

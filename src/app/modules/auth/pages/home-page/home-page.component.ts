import { Component } from '@angular/core';
import { Product } from '../../interfaces/Product.interface';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  carrefour: Product[] = [];
  ahorramas: Product[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService, private router: Router) {}

 ngOnInit(): void {
    const carrefourCache = localStorage.getItem("carrefour");
  
    if (carrefourCache) {
      this.carrefour = JSON.parse(carrefourCache);
      console.log(this.carrefour); // Añade esta línea
      this.mostrarProductosAleatoriosCarrefour();
      this.checkLoadingState();
    } else {
      this.productService.getCarrefour().subscribe((data: any) => {
        console.log(data); // Añade esta línea
        this.carrefour = data;
        localStorage.setItem("carrefour", JSON.stringify(data));
        this.mostrarProductosAleatoriosCarrefour();
        this.checkLoadingState();
      });
    }

    const ahorramasCache = localStorage.getItem("ahorramas");
  
    if (ahorramasCache) {
      this.ahorramas = JSON.parse(ahorramasCache);
      console.log(this.ahorramas)
      this.mostrarProductosAleatoriosAhorraMas();
      this.checkLoadingState();
    } else {
      this.productService.getAhorramas().subscribe((data: any) => {
        console.log(data); // Añade esta línea
        this.ahorramas = data;
        localStorage.setItem("ahorramas", JSON.stringify(data));
        this.mostrarProductosAleatoriosAhorraMas();
        this.checkLoadingState();
      });
    }
      // Hacer lo mismo para Ahorramas...
  }
  // Hacer lo mismo para Ahorramas..

  mostrarProductosAleatoriosCarrefour() {
    const totalProductos = this.carrefour.length;
    const indicesAleatorios: number[] = [];

    // Generar 10 índices aleatorios únicos
    while (indicesAleatorios.length < 10) {
      const indiceAleatorio = Math.floor(Math.random() * totalProductos);
      if (!indicesAleatorios.includes(indiceAleatorio)) {
        indicesAleatorios.push(indiceAleatorio);
      }
    }

    // Obtener los productos aleatorios
    this.carrefour = indicesAleatorios.map(indice => this.carrefour[indice]);
  }

  mostrarProductosAleatoriosAhorraMas() {
    const totalProductos = this.ahorramas.length;
    const indicesAleatorios: number[] = [];

    // Generar 10 índices aleatorios únicos
    while (indicesAleatorios.length < 10) {
      const indiceAleatorio = Math.floor(Math.random() * totalProductos);
      if (!indicesAleatorios.includes(indiceAleatorio)) {
        indicesAleatorios.push(indiceAleatorio);
      }
    }

    // Obtener los productos aleatorios
    this.ahorramas = indicesAleatorios.map(indice => this.ahorramas[indice]);
  }
  checkLoadingState() {
    // Verificar si ambos conjuntos de datos han sido cargados
    if (this.carrefour.length > 0 && this.ahorramas.length > 0) {
      this.isLoading = false; // Cambiar el estado de isLoading cuando todos los datos estén disponibles
    }
  }

  goToAhorramas(){
    window.open('https://www.ahorramas.com/', '_blank');
  }
  goToCarrefour(){
    window.open('https://www.carrefour.es/supermercado?ic_source=portal-y-corporativo&ic_medium=category-food-box&ic_content=ns', '_blank');
  }

  addToFavorites(title: string, image: string, price:number) {
    const favoritesFromLocal = JSON.parse(localStorage.getItem('favoritos') || '[]');

    console.log(favoritesFromLocal);

    const existingTitleIndex = favoritesFromLocal.findIndex((prodFav: any) => prodFav.title === title && prodFav.image === image && prodFav.price === price);

    if (existingTitleIndex === -1) {
        // El producto no está en favoritos, así que lo agregamos
        favoritesFromLocal.push({ title: title, price: price,image: image }); // Agregamos el producto como un objeto con su título
    } else {
        // El producto ya está en favoritos, así que lo eliminamos
        favoritesFromLocal.splice(existingTitleIndex, 1);
    }

    // Actualizamos la lista de favoritos en el almacenamiento local
    localStorage.setItem('favoritos', JSON.stringify(favoritesFromLocal));

}
isFavorite(productTitle: string): boolean {
  const favoritesFromLocal = JSON.parse(localStorage.getItem('favoritos')!);
  return favoritesFromLocal.some((prodFav: any) => prodFav.title === productTitle);
}
compareProduct(title: string): void {
  // Redirigir a la ruta /comparator y pasar el título del producto como parámetro
  this.router.navigate(['/comparator'], { queryParams: { title: title } })
}

}

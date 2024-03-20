import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  query: string = '';
  resultados: any[] = [];
  datos: any[] = [];
  dataAhorramas: any[] = [];
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.obtenerDatos().subscribe((data: any) => {
      this.datos = data;
    });
  }

  buscar(event:any) {
    this.resultados = this.datos.filter(item => item.price && item.image && item.title.toLowerCase().includes(this.query.toLowerCase()));
    console.log('Resultados:', this.resultados); // Imprime los resultados
    this.authService.setInputValue(this.query);
    this.router.navigate(['/results'], { state: { resultados: this.resultados, query: this.query } });
  }

  // comparator(){

  //    let ahorramas = localStorage.getItem("ahorramas");

  //    if (ahorramas) {
  //      this.dataAhorramas = JSON.parse(ahorramas);
  //    } 

  //    //1. Obtener el nombre del producto a comparar (el que has pichado)
  //    //2. Buscar el nombre en el array del ahorramas con un find.
  //    //3. Cuando lo encuentre comparar los precios, poner el precio mas caro en rojo y dar un mensaje de compralo...
  //    //4. Todo esto mostrandolo en la ruta /comparator

  //   // const titulosUnicos = new Set<string>(); // Utilizamos un Set para almacenar los títulos únicos
  //   // this.resultados.forEach(producto => {
  //   //   if (!titulosUnicos.has(producto.titulo)) {
  //   //     titulosUnicos.add(producto.titulo);
  //   //   } else {
  //   //     const precioActual = producto.precio;
  //   //     const productoAnterior = this.resultados.find(p => p.titulo === producto.titulo && p.precio < precioActual);
  //   //     if (productoAnterior) {
  //   //       productoAnterior.precio < producto.precio ? productoAnterior.color = 'green' : producto.color = 'green';
  //   //     }
        
  //   //   }
      
  //   // });
    
  // }

  comparator() {
    let ahorramas = localStorage.getItem("ahorramas");
  
    if (ahorramas) {
      this.dataAhorramas = JSON.parse(ahorramas);
    } 
  
    // 1. Guardar el producto seleccionado al hacer clic
    const productoSeleccionado = { ...this.resultados.find(item => item.selected) };
    console.log(productoSeleccionado);
    
    // if (!productoSeleccionado) {
    //   console.log('Producto no seleccionado');
    //   return; // Si no hay ningún producto seleccionado, salir de la función
    // }
  
    // 2. Buscar el producto seleccionado en el array de Ahorramas
    const productoEnAhorramas = this.dataAhorramas.find(item => item.title === productoSeleccionado.title);
  
    if (!productoEnAhorramas) {
      console.log('Producto no encontrado en Ahorramas');
      return; // Si el producto no se encuentra en Ahorramas, salir de la función
    }
  
    // 3. Comparar los precios
    if (productoSeleccionado.price > productoEnAhorramas.price) {
      productoSeleccionado.color = 'red'; // Poner el precio del producto seleccionado en rojo
      productoEnAhorramas.color = 'green'; // Poner el precio del producto en Ahorramas en verde
      console.log('¡Cómpralo en Ahorramas!');
    } else {
      productoSeleccionado.color = 'green'; // Poner el precio del producto seleccionado en verde
      productoEnAhorramas.color = 'red'; // Poner el precio del producto en Ahorramas en rojo
      console.log('¡Cómpralo aquí!');
    }
  
    // 4. Mostrar los resultados en la ruta /comparator
    this.router.navigate(['/comparator'], { state: { resultado: productoSeleccionado, ahorramas: productoEnAhorramas } });
  }
  
}

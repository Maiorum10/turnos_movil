import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: any;
  nombre: any;
  mensajes:any;
  clave: string='';
  cedula: string='';
  focus;
  focus1;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit() { }
  verificar(){
    if(this.cedula==''){
      Swal.fire('Error','Ingrese la cédula','error');
    }else if(this.clave==''){
      Swal.fire('Error','Ingrese la clave','error');
    }else{
      let body={
        'accion': 'login_turnos',
        'cedula': this.cedula,
        'clave' : this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuario=res.datos;
            this.servicio.usuarioId=this.usuario[0].id_usuario;
            this.servicio.cedulaSesion=this.usuario[0].cedula;
            this.nombre=this.usuario[0].nombre;
            console.log(this.servicio.usuarioId)
            Swal.fire('Bienvenido','' +this.nombre+ '');
            this.router.navigateByUrl("navbar") 
          }else{
            Swal.fire('Error','Datos incorrectos','error');
          }
        },(err)=>{
          Swal.fire('Error','Compruebe su conexión','error');
        });
      });
    }
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
    console.log('cancelado');
  }
}

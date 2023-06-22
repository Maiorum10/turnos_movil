import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    usuario: any;
    nombre: string='';
    apellido: string='';
    clave: string='';
    cedula: string='';
    estado: string='';
    cedulaSesion: any;
    idSesion: any=0;
    u: any=0;
    test : Date = new Date();
    focus;
    focus1;
    focus2;

    constructor(private servicio: AccesoService,
        private router: Router) { }

    ngOnInit( ) {
        console.log(this.servicio.usuarioId);
        this.cedulaSesion=this.servicio.cedulaSesion;
        this.idSesion=this.servicio.usuarioId;
    if(this.idSesion<1){
      this.estado='guardando';
      console.log(this.estado);
    }else{
      this.consultarUsuario();
      this.estado='actualizando';
      console.log(this.estado);
      this.validador=true;
    }
    }

    si(){
        if(this.idSesion<1){
          this.guardar();
        }else{
          this.actualizarUsuario();
        }
      }

    public validador; 
    validadorDeCedula(cedula: String) {
    let cedulaCorrecta = false;
    if (cedula.length == 10)
    {    
        let tercerDigito = parseInt(cedula.substring(2, 3));
        if (tercerDigito < 6) {
            // El ultimo digito se lo considera dígito verificador
            let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];       
            let verificador = parseInt(cedula.substring(9, 10));
            let suma:number = 0;
            let digito:number = 0;
            for (let i = 0; i < (cedula.length - 1); i++) {
                digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];      
                suma += ((parseInt((digito % 10)+'') + (parseInt((digito / 10)+''))));
          //      console.log(suma+" suma"+coefValCedula[i]); 
            }
            suma= Math.round(suma);
          //  console.log(verificador);
          //  console.log(suma);
          //  console.log(digito);
            if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10)== verificador)) {
                cedulaCorrecta = true;
            } else if ((10 - (Math.round(suma % 10))) == verificador) {
                cedulaCorrecta = true;
            } else {
                cedulaCorrecta = false;
            }
          } else {
            cedulaCorrecta = false;
          }
    } else {
          cedulaCorrecta = false;
    }
    this.validador= cedulaCorrecta;
    }

    consultarUsuario(){
        let body={
          'accion': 'consultar_uturnos',
          'id_usuario': this.idSesion
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              this.usuario=res.datos;
              this.cedula = this.usuario[0].cedula;
              this.nombre = this.usuario[0].nombre;
              this.apellido = this.usuario[0].apellido;
              this.clave = this.usuario[0].clave;
            }else{
              Swal.fire('No existe el usuario');
            }
          }, (err)=>{
            Swal.fire('Error','Compruebe su conexión','error');
          });
        });
      }

    verificarUsuario(){
        let body={
          'accion': 'verificar_uturnos',
          'cedula': this.cedula
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(this.cedula==this.cedulaSesion){
              console.log('Mismo usuario');
              this.si();
            }else if(res.estado){
              this.u=1;
              Swal.fire('Error','Usuario ya registrado','error');
              console.log(this.u +' Ya existe el usuario');
              
            }else{
              this.u=2;
              console.log(this.u +'No existe el usuario');
              this.si();
            }
          });
        });
      }

    guardar(){
        if(this.validador==true){
          if(this.nombre==''){
            Swal.fire('Error','Ingrese el nombre','error');
          }else if(this.apellido==''){
            Swal.fire('Error','Ingrese el apellido','error');
          }else if(this.cedula==''){
            Swal.fire('Error','Ingrese la cedula','error');
          }else if(this.clave==''){
            Swal.fire('Error','Ingrese la clave','error');
          }else{
            let body={
              'accion':'guardar_uturnos',
              'nombre': this.nombre,
              'apellido': this.apellido,
              'clave': this.clave,
              'cedula': this.cedula
            }
            console.log(body);
              return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                this.usuario=res;
                if(res.estado){
                Swal.fire('Usuario registrado');
                this.router.navigateByUrl("login") 
                }else{
                    Swal.fire('Error','Datos incorrectos','error');
                }
              }, (err)=>{
                //Error
                console.log(err);
                Swal.fire('Error','Compruebe su conexión','error');
              });
            });
      }
          }
            else{
            Swal.fire('Error','Cédula inválida','error');
        }
    }

    actualizarUsuario(){
        if(this.validador==true){
          if(this.nombre==''){
            Swal.fire('Error','Ingrese el nombre','error');
          }else if(this.apellido==''){
            Swal.fire('Error','Ingrese el apellido','error');
          }else if(this.cedula==''){
            Swal.fire('Error','Ingrese la cedula','error');
          }else if(this.clave==''){
            Swal.fire('Error','Ingrese la clave','error');
          }else{
            console.log('actualizando')
        let body={
          'accion':'actualizar_uturnos',
          'cedula': this.cedula,
          'nombre': this.nombre,
          'apellido': this.apellido,
          'clave': this.clave,
          'id_usuario': this.idSesion
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            this.usuario=res;
            if(res.estado){
                Swal.fire('Usuario actualizado');
                this.router.navigateByUrl("home") 
            }else{
                Swal.fire('Usuario no actualizado','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Compruebe su conexión','error');
          });
        });
        }
          }
            else{
            Swal.fire('Error','Cédula inválida','error');
        }
    }
}

angular.module('starter.controllers', ['uiGmapgoogle-maps', 'ngCordova'])

  .filter('sexoFilter', function(){
    return function(input){
      var sexo = "Masculino";
      if(input == "F"){
        sexo = "Femenino";
      }
      return sexo;
    };
  })

  .filter('negativo', function(){
  return function(id){
    var valor= id*(-1);

      return valor;
    };
  })


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PrincipalController', function($scope, $stateParams) {})
.controller('VacunaController', function($scope, $stateParams, $http) {
  console.log('stateParams');
  $scope.getVacuna = function(id) {
    $http(
      {
        method:'GET',
        url: 'http://esdeporvida.com/projects/minsa/api/android/getVacuna.php?id=' + id,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(response) {
          $scope.vacuna = response;
    });
  };
  $scope.getVacuna($stateParams.vacunaID);
})
.controller('VacunasController', function($scope, $stateParams, $rootScope, $http) {
  console.log('VacunasController');
    $scope.getVacunas=function() {
      $http({method:'GET',url: 'http://esdeporvida.com/projects/minsa/api/android/getVacunas.php', headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
        $scope.vacunas = response;
      });
    };
    $scope.getVacunas();
})
.controller('ResultadosDetailController', function($scope, $stateParams) { })


.controller('ResultadosController', function($scope, $location,$rootScope, $http, $ionicLoading) {
  console.log('ResultadosController ');
  $scope.getChildVacunas = function () {
    console.log('ResultadosController > getChildVacunas');
    $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
    $http({
      method:'POST',
      url: 'http://esdeporvida.com/projects/minsa/api/android/getVacunasA.php',
      data: $.param({data:$rootScope.nino_ws}),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
      console.log('ResultadosController > getChildVacunas : success > response', response);
      $scope.vacunas = response;


      $.each($scope.vacunas.contenido, function( index, value ) {
        var CurrentDate = new Date();

        var fecha = [];
        fecha = value.fecha_vacunacion.split("-");

         var SelectedDate = new Date(
          fecha[0],fecha[1],fecha[2]);
        if(CurrentDate > SelectedDate){
            //agregar pendiente true
        }

      });
      

      $ionicLoading.hide();
    });

$ionicLoading.hide();
  };

  $scope.checkData = function () {
    if (!$rootScope.nino_ws) {
      $location.path('/app/buscar').replace();
    } else{
      $scope.getChildVacunas();
    }
  };
  $scope.pendiente = function (fIndex, index) {
    alert(fIndex);
    alert(index);
   alert($scope.vacunas[fIndex].contenido[index].nombre_vacuna);
   alert($scope.vacunas[fIndex].contenido[index].fecha_estimada);
  };
 $scope.pendienteProxima = function (fIndex, index) {
     var CurrentDate = new Date();
     var fecha = [];
     fecha = $scope.vacunas[fIndex].contenido[index].fecha_estimada.split("-");

        var SelectedDate = new Date(fecha[0],fecha[1],fecha[2]);
        

        if(CurrentDate > SelectedDate){
            return false;}
        else
              {return true;}
        
  };

  $scope.checkData();

    $scope.showdatos = function() {
      $ionicLoading.hide();
      $location.path('/app/buscar').replace();
  }

     $scope.alertas = function() {
      $ionicLoading.hide();
      $location.path('/app/correos').replace();
  }
})


/*
.controller('ResultadosController', function($scope, $stateParams, $location, $rootScope) {
  $scope.nino_ws = $rootScope.nino_ws;
  $scope.vacunas = $rootScope.vacunas;
  $scope.correos = $rootScope.correos;
  $scope.data = {"tipo": "dni", "numero": 12345678, "paterno": "Castillo", "materno":"garcia", "nacimiento":"22/05/2015"};
  $scope.calendario = function(numero){
    $location.path('/app/playlists/'+numero).replace();
  };
})*/

.controller('BuscarController', function($scope, $stateParams, $location, $http, $ionicLoading, $rootScope) {
  $scope.showTable=false;
  $scope.showDatos = false;
  $scope.neneData = {"tipo":"3", "numero":42579084};
  //$scope.neneData = {"tipo":"1", "numero":1000999595};


  $scope.buscarNeneByCNV = function() {
  $scope.showTable=false;
  $scope.showDatos = false;
   if($scope.neneData.tipo == "1"){
        console.log('BuscarController > buscarNeneByCNV');
        $scope.loading = $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
           $http(
            {method:'GET',
            url: 'http://esdeporvida.com/projects/minsa/api/wsByNumero.php?numero='+$scope.neneData.numero,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
              console.log('BuscarController > buscarNeneByCNV : done');


//var response= {"success":{"NuCnv":"10009995952","UbiDomMad":"250302","Sexo":"F","Peso":"2680","Talla":"49 ","FecNac":"20151201","LugNac":"01","UbiNac":"250302","AtePor":"02","TipPar":"01","ConPar":"01","DurEmb":"39","Fin":"02"}};
              delete $rootScope.nino_ws;
              if( response.success){
                console.log(response.success);
                console.log('BuscarController > buscarNeneByCNV : done : if');
                $ionicLoading.hide();
                $rootScope.nino_ws        = response.success;
                $rootScope.nino_ws.Tipo = "CNV";
                $rootScope.nino_ws.FecNac = $rootScope.nino_ws.FecNac.substr(0,4) + "-" + $rootScope.nino_ws.FecNac.substr(4,2) + "-" + $rootScope.nino_ws.FecNac.substr(6,2);
                console.log('BuscarController > buscarNeneByCNV : done : if : response', response);
                console.log('BuscarController > buscarNeneByCNV : done : if : $rootScope.nino_ws', $rootScope.nino_ws);
                $scope.showDatos=true;    
                //$location.path('/app/resultados').replace();
            } else{
                $ionicLoading.hide();
                console.log('BuscarController > buscarNeneByCNV : done : else');
                alert("Lo lamento, " + response.error);
              }
          }).error(function() {
              alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde.');
              $ionicLoading.hide();
          });
  
    }

     else if($scope.neneData.tipo == "2"){
            console.log('BuscarController > buscarNeneByCNV');
            $scope.loading = $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
              $http(
                {method:'GET',
                url: 'http://esdeporvida.com/projects/minsa/api/wsbyDNI.php?numero='+$scope.neneData.numero,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
                  console.log('BuscarController > buscarNeneByCNV : done');
                  delete $rootScope.nino_ws;
                  if( response.success){
             
                    console.log('BuscarController > buscarNeneByCNV : done : if');
                    $ionicLoading.hide();
                    $rootScope.nino_ws        = response.success;

                    $rootScope.nino_ws.FecNac = $rootScope.nino_ws.fecha_nac;
                    $rootScope.nino_ws.Talla = $rootScope.nino_ws.talla;
                    $rootScope.nino_ws.Peso = $rootScope.nino_ws.peso;
                    $rootScope.nino_ws.NuCnv = $rootScope.nino_ws.nro_documento;

                    console.log('BuscarController > buscarNeneByCNV : done : if : response', response);
                    console.log('BuscarController > buscarNeneByCNV : done : if : $rootScope.nino_ws', $rootScope.nino_ws);
                   $rootScope.nino_ws.Tipo = "DNI";
                    $scope.showDatos=true;   
                    //$location.path('/app/resultados').replace();
                  } else{
                    $ionicLoading.hide();
                    console.log('BuscarController > buscarNeneByCNV : done : else');
                    alert("Lo lamento, " + response.error);
                  }
              }).error(function() {
                  alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde.');
                  $ionicLoading.hide();
              });
        }

       else {
        console.log('BuscarController > buscarNeneByCNV');
        $scope.loading = $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
          $http(
            {method:'GET',
            url: 'http://esdeporvida.com/projects/minsa/api/wsByDniMadre.php?numero='+$scope.neneData.numero,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
              console.log('BuscarController > buscarNeneByCNV : done');
              delete $rootScope.nino_ws;
              if( response.success){
     
                console.log('BuscarController > buscarNeneByCNV : done : if');
                $ionicLoading.hide();

                $rootScope.ninos_ws        = response.success;
          
                $scope.showTable=true;
                console.log('BuscarController > buscarNeneByCNV : done : if : response', response);
                console.log('BuscarController > buscarNeneByCNV : done : if : $rootScope.nino_ws', $rootScope.nino_ws);
               // $location.path('/app/resultados').replace();


             } else{
                $ionicLoading.hide();
                console.log('BuscarController > buscarNeneByCNV : done : else');
                alert("Lo lamento, " + response.error);
              }
          }).error(function() {
              alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde.');
              $ionicLoading.hide();
          });

    }

  };


  $scope.selecNino = function(index) {
      $rootScope.nino_ws = $rootScope.ninos_ws[index];
      $ionicLoading.hide();
      $location.path('/app/resultados').replace();
  }
  $scope.consularInicio = function() {
      $ionicLoading.hide();
      $scope.showDatos = false;
  }
$scope.showtable = function() {
      $ionicLoading.hide();
      $location.path('/app/resultados').replace();
  }
  

})

.controller('AdicionalController', function($scope, $filter, $location, $rootScope, $http, $ionicLoading, $ionicPopup) {
  console.log('AdicionalController');
  $scope.vacunarNene = function(){
    console.log('AdicionalController > vacunarNene');
    $scope.nino_ws.fecha_medicion_ = $filter("date")($scope.nino_ws.fecha_medicion, 'yyyy-MM-dd');
    $ionicLoading.show({content: 'Registrando Informacion Adicional...', showBackdrop: true });
    $http({
      method:'POST',
      url: 'http://esdeporvida.com/projects/minsa/api/android/adicional.php',
      data: $.param({nino_ws:$scope.nino_ws, usuario:$scope.usuario }),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
      $ionicLoading.hide();
      $ionicPopup.alert({ title: 'Listo!', template: 'La informacion Adicional fue registrada exitosamente.' });
      $location.path('/app/buscar').replace();
    }).error(function() {
        $ionicLoading.hide();
        $ionicPopup.alert({ title: 'Error!', template: 'El servidor no responde, por favor intentelo mas tarde.' });
    });
  };

  $scope.checkUser = function(){
    if (!$rootScope.usuario) {
      $location.path('/app/logeo').replace();
    } else{
      $scope.nino_ws = $rootScope.nino_ws;
      $scope.nino_ws.fecha_medicion = new Date();
    }
  };
  $scope.checkUser();
})

.controller('VacunarloYaController', function($scope, $filter, $location, $rootScope, $http, $ionicLoading, $ionicPopup) {
  console.log('VacunarloYaController');

  $scope.vacunarNene = function() {
    $scope.item.fecha_vacunacion_ = $filter("date")($scope.item.fecha_vacunacion, 'yyyy-MM-dd');
    $ionicLoading.show({content: 'Registrando al chamaco...', showBackdrop: true });
    $http({
      method:'POST',
      url: 'http://esdeporvida.com/projects/minsa/api/android/vacunarNene.php',
      data: $.param({item:$scope.item, nino_ws:$scope.nino_ws, usuario:$scope.usuario }),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
      $ionicLoading.hide();
      $ionicPopup.alert({ title: 'Vacunado!', template: 'El niño fue vacunado exitosamente' });
      console.log($scope.item);
      $location.path('/app/profesional-buscar').replace();
    }).error(function() {
        $ionicLoading.hide();
        $ionicPopup.alert({ title: 'Error!', template: 'El servidor no responde, por favor intentelo mas tarde.' });
    });
  };

  $scope.checkUser = function(){
    if (!$rootScope.usuario) {
      $location.path('/app/logeo').replace()
    } else{
      $scope.item    = $rootScope.item;
      $scope.nino_ws = $rootScope.nino_ws;
      $scope.usuario = $rootScope.usuario;
      // set current date(yyyy,mm,dd)
      //$scope.item.fecha_vacunacion = moment();
      //$scope.item.fecha_vacunacion = new Date(2016, 01, 11);
      $scope.item.fecha_vacunacion = new Date();
      //$scope.item.fecha_vacunacion = ( new Date() ).toISOString().split("T")[0];
      //console.log(( new Date() ).toISOString().split("T")[0]); : 2016-01-11
    }
  };
  $scope.checkUser();
})

.controller('ProfesionalVacunarController', function($scope, $stateParams, $location, $rootScope, $http, $ionicLoading,  $ionicPopup) {
  console.log('ProfesionalVacunarController ');
  //$ionicPopup.alert({ title: 'Error!', template: 'Sorry something went wrong' });
  $scope.getChildVacunas = function () {
    //console.log('ProfesionalVacunarController > getChildVacunas');
    $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
    $http({method:'POST',url: 'http://esdeporvida.com/projects/minsa/api/android/getVacunasA.php', data: $.param({data:$rootScope.nino_ws}), headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
      console.log('ProfesionalVacunarController > getChildVacunas : success > response', response);
      $scope.vacunas = response;
      $ionicLoading.hide();
    });
  };

  $scope.vacunarloYa = function (item) {
    $rootScope.item = item;
    $location.path('/app/vacunarlo-ya').replace();
  };

  $scope.adicional = function () {
    $location.path('/app/adicional').replace();
  };

  $scope.checkData = function () {
    if (!$rootScope.nino_ws) {
      $location.path('/app/profesional-buscar').replace();
    } else{
      $scope.getChildVacunas();
    }
  };
  $scope.checkData();
})

.controller('ProfesionalBuscarController', function($scope, $stateParams, $location, $http, $ionicLoading, $rootScope) {
 
  console.log('ProfesionalBuscarController > $rootScope.usuario', $rootScope.usuario);
  $scope.neneData = {"numero":1000999595};
  $scope.buscarNeneByCNV = function() {
  
    console.log('ProfesionalBuscarController > buscarNeneByCNV');
    $scope.loading = $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
      $http(
        {method:'GET',
        url: 'http://esdeporvida.com/projects/minsa/api/wsByNumero.php?numero='+$scope.neneData.numero,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
          console.log('ProfesionalBuscarController > buscarNeneByCNV : done');
          delete $rootScope.nino_ws;
          if( response.success){
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : if');
            $ionicLoading.hide();
            $rootScope.nino_ws        = response.success;
            $rootScope.nino_ws.FecNac = $rootScope.nino_ws.FecNac.substr(0,4) + "-" + $rootScope.nino_ws.FecNac.substr(4,2) + "-" + $rootScope.nino_ws.FecNac.substr(6,2);
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : if : response', response);
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : if : $rootScope.nino_ws', $rootScope.nino_ws);
            $location.path('/app/profesional-vacunar').replace();
          } else{
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : else');
            alert("Lo lamento, " + response.error);
            $ionicLoading.hide();
          }
      }).error(function() {
          alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde.');
          $ionicLoading.hide();
      });
  };

  $scope.checkUser = function () {
    if (!$rootScope.usuario)  $location.path('/app/logeo').replace();
  }

  $scope.checkUser();

})
.controller('LogeoController', function($scope, $state, $http, $ionicLoading, $location, $rootScope, $ionicPopup) {
  console.log('LogeoController');
  if (!$rootScope.usuario) {
    console.log('LogeoController > if');
    $scope.loginData = {};
    $scope.doLogin = function() {
      if( $scope.loginData.username && $scope.loginData.password ) {
        console.log($scope.loginData);
        $scope.loading = $ionicLoading.show({content: 'Iniciando sesion...', showBackdrop: true });
        $http({method:'POST',url: 'http://esdeporvida.com/projects/minsa/api/android/login.php', data:$.param($scope.loginData), headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
            $ionicLoading.hide();
            if(response.success){
              $rootScope.usuario = response.success;
              //$ionicPopup.alert({ title: 'Bienvenido', template: 'Bienvenido ' + response.success.nombres });
              $location.path('/app/profesional-buscar').replace();
            }
            if (response.error) {
              $ionicPopup.alert({ title: 'Error', template: response.error });
              //alert(response.error);
            }
        }).error(function(){
          $ionicLoading.hide();
          $ionicPopup.alert({ title: 'Error Server', template: 'Lo lamento, el servidor no responde, por favor intentelo mas tarde.' });
        });
      } else{
        $ionicPopup.alert({ title: 'Campos Vacios', template: 'Por favor completa todos los campos para iniciar sesion.' });
      }
    };
  } else{
    console.log('LogeoController > else');
    //$location.path('/app/profesional-buscar').replace();
    $state.go('app.profesional-buscar');
  }
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
  $scope.playlistId = $stateParams.playlistId;
})
.controller('RegistrarController', function($scope, $state, $http, $ionicLoading, $location, $rootScope, $ionicPopup) {
  
  console.log("RegistrarController");
  $scope.vacunarNene = function(nino_nw){
    console.log(nino_nw);
    $scope.loading = $ionicLoading.show({content: 'Registrando...', showBackdrop: true });
          $http({method:'POST',url: 'http://esdeporvida.com/projects/minsa/api/android/registrar.php', data:$.param(nino_nw), headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
            $ionicLoading.hide();
            if(response.success){
              console.log(response.success);
              $location.path('/app/buscar').replace();
            }
            if (response.error) {
              $ionicPopup.alert({ title: 'Error', template: response.error });
            }
        }).error(function(){
          $ionicLoading.hide();
          $ionicPopup.alert({ title: 'Error', template: 'Lo lamento, el servidor no responde, por favor intentelo mas tarde.' });
        });
  };
})


.controller('correosController', function($scope, $stateParams, $location, $rootScope, $http, $ionicLoading,  $ionicPopup) {
 $scope.showCorreos=false;

 $http(
        {method:'GET',
        url: 'http://esdeporvida.com/projects/minsa/api/android/getCorreos.php?numero='+$rootScope.nino_ws.NuCnv,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
          console.log('ProfesionalBuscarController > buscarNeneByCNV : done');
         
         
          if( response.success){
            $ionicLoading.hide();
            $rootScope.infoAdicional        = response.success;
            $scope.showCorreos=true;
          }

         else{
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : else');
            alert("Lo lamento, " + response.error);
            $ionicLoading.hide();
          }
      }).error(function() {
          alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde.');
          $ionicLoading.hide();
      });


})

.controller('CentrosController', function( $scope, $state, $cordovaGeolocation, $ionicLoading, $http,  $ionicPopup) {
    $scope.first=true;
      var markers =[];
    var infoWindow;
    var user = "img/user.png";
    var centroimg = "img/centros.png";
    var geoLatitude ;
    var geoLongitude;
    $scope.dist_rela=9999999;
    $scope.min=9999999;

      $scope.loading = $ionicLoading.show({content: 'Registrando...', showBackdrop: true });
          $http({method:'POST',url: 'http://esdeporvida.com/projects/minsa/api/getCentros.php', headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
            $ionicLoading.hide();
            $scope.data = response;


             $cordovaGeolocation.getCurrentPosition(options).then(function(position){
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          geoLatitude = position.coords.latitude;
          geoLongitude = position.coords.longitude;
       
          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
           var  pos = {
            lat: geoLatitude,
            lng: geoLongitude
          };
       
          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

           $scope.map.setCenter(pos);

          var GeoMarker = new google.maps.Marker({
                position: pos,
                map: $scope.map,
                icon: user
           });
          $scope.cercano = {};

              $.each($scope.data , function( index, value ) {
             
            var beachMarker;
            beachMarker = new google.maps.Marker({
                 position: {lat: parseFloat(value.latitud), lng: parseFloat(value.longitud)},
                  map: $scope.map,
                  icon: centroimg,
                  
                  title: value.nombre
            });
            markers.push(beachMarker); // add marker to array
            //alert(markers);
            beachMarker.addListener('click', function() {

              $scope.first=false;

               if (infoWindow !== void 0) {
                    infoWindow.close();
               }

               infoWindow = new google.maps.InfoWindow({
                  content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>"+value.tipo+"</td></tr><tr>"+
                  "<td><b>"+value.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='fa fa-map-marker fa-1x'></i></td><td>"+value.direccion+", "+value.distrito+", "+value.provincia+", "+value.departamento+"</td>"+
                "</tr><tr><td><i class='fa fa-phone fa-1.5x'></i></td><td>"+value.telefono+"</td></tr><tr><td><i class='fa fa-clock-o fa-1x'></i></td><td>"+value.horario+"</td>"+
                "</tr><tr><td><i class='fa fa-user fa-1x'></i></td><td>"+value.resp+"</td></tr></tbody></table>",
                maxHeight: 400,
                maxWidth: 300
               });
                      

               if (infoWindow) {
      //           alert('entró');
                   infoWindow.close();
                }
                 infoWindow.open($scope.map, beachMarker);
            });

            $scope.dist_rela=Math.sqrt(Math.pow((geoLatitude-value.latitud),2)+Math.pow((geoLongitude-value.longitud),2));
        


              //console.log(parseFloat(value.latitud));
              $scope.dist_rela=Math.sqrt(Math.pow((geoLatitude-value.latitud),2)+Math.pow((geoLongitude-value.longitud),2));

              if($scope.dist_rela<$scope.min && $scope.first==true){

                $scope.min = $scope.dist_rela;
                $scope.cercano.nombre = value.nombre;
                $scope.cercano.telefono = value.telefono;
                $scope.cercano.horario = value.horario;
                $scope.cercano.ubica2 = ", "+value.distrito+", "+value.provincia+", "+value.departamento;
                $scope.cercano.tipo = value.tipo;
                $scope.cercano.ubica = value.direccion;
                $scope.cercano.resp = value.resp;
                $scope.cercano.latitud = value.latitud;
                $scope.cercano.longitud = value.longitud;
              }
          });

                $scope.first=false;

            infoWindow = new google.maps.InfoWindow({
              content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>"+$scope.cercano.tipo+"</td></tr><tr>"+
              "<td><b>"+$scope.cercano.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='fa fa-map-marker fa-1x'></i></td><td>"+$scope.cercano.ubica+", "+$scope.cercano.ubica2+"</td>"+
            "</tr><tr><td><i class='fa fa-phone fa-1.5x'></i></td><td>"+$scope.cercano.telefono+"</td></tr><tr><td><i class='fa fa-clock-o fa-1x'></i></td><td>"+$scope.cercano.horario+"</td>"+
            "</tr><tr><td><i class='fa fa-user fa-1x'></i></td><td>"+$scope.cercano.resp+"</td></tr></tbody></table><p>Centro Mas Cercano</p>",
            maxHeight: 400,
            maxWidth: 300
           });

        var beachMarker2 = new google.maps.Marker({
            position: {lat: parseFloat($scope.cercano.latitud), lng: parseFloat($scope.cercano.longitud)},
            map: $scope.map,
            icon: centroimg
            
          });
        infoWindow.open($scope.map, beachMarker2);

       
        }, function(error){
          console.log("Could not get location");
        });




        }).error(function(){
             $scope.data = [{"codigo":"00006171","nombre":"JUAN PEREZ CARRANZA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. CUZCO 925","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":"-12.053487","longitud":"-77.022946"},{"codigo":"00006172","nombre":"JARDIN ROSA DE SANTA MARIA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR ANCASH 1529 AAHH ROSA DE SANTA MARIA","telefono":"3284217","horario":"L-S: 8-14 HORAS","resp":"GADY CASTA\u00d1EDA CANO","latitud":"-12.042961","longitud":"-77.011573"},{"codigo":"00006186","nombre":"CONDE DE LA VEGA BAJA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. CONDE DE LA VEGA BAJA 488","telefono":"3301547","horario":"L-V: 8-19 HORAS; S: 8-14 HORAS","resp":"RONALD SALAZAR MALQUICHAGUA","latitud":"-12.0381579","longitud":"-77.0546325"},{"codigo":"00006187","nombre":"CENTRO DE SALUD MIRONES BAJO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. BRUNO TERREROS 144","telefono":"3360243","horario":"L-S: 8-14 HORAS","resp":"LUIS FERNANDO BAZAN PINO","latitud":"-12.036542","longitud":"-77.074196"},{"codigo":"00006188","nombre":"RESCATE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR PRATT S\/N AAHH 11 DE OCTUBRE","telefono":"3366430","horario":"L-S: 8-14 HORAS","resp":"JESUS OSPINA CHAVEZTA","latitud":"-12.041348","longitud":"-77.062324"},{"codigo":"00006189","nombre":"PALERMO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"MZ L LOTE 20 AAHH 1\u00b0 DE SETIEMBRE ALT CUADRA 21 AV","telefono":"3366341","horario":"L-S: 8-14 HORAS","resp":"WALTER ESQUIVEL SANCHEZ","latitud":"-12.041512","longitud":"-77.068257"},{"codigo":"00006190","nombre":"SANTA ROSA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"CALLE CRESPO Y CASTILLO S\/N ALTURA CUADRA 11 AV MO","telefono":"7616175","horario":"L-S: 8-14 HORAS","resp":"JULIO ALEJANDRO ALTAMIRANO MEJIA","latitud":"-12.036852","longitud":"-77.059864"},{"codigo":"00006191","nombre":"SAN SEBASTIAN","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. ICA 774-778","telefono":"4251830","horario":"MA\u00d1ANA: 8-13 HORAS; TARDE: 13-19 HORAS","resp":"HUMBERTO DELGADO VALLEJOS","latitud":"-12.042985","longitud":"-77.038455"},{"codigo":"00006192","nombre":"MIRONES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"AV. LUIS BRAYLE CUADRA 13","telefono":"4253590","horario":"L-V: 8-20 HORAS; S: 8-14 HORAS","resp":"MARIA DOMITILA AMAYA FIESTAS","latitud":"-12.051399","longitud":"-77.067511"},{"codigo":"00006193","nombre":"UNIDAD VECINAL N\u00ba 3","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"BLOCK N\u00ba 1 UNIDAD VECINAL N\u00ba 3","telefono":"4648455","horario":"L-V: 8-19 HORAS; S: 8-14 HORAS","resp":"NORA CARRASCO BURGOS","latitud":"-12.051539","longitud":"-77.082336"},{"codigo":"00006194","nombre":"CENTRO DE SALUD VILLA MARIA PERPETUO SOCORRO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. VILLA MARIA 745","telefono":"4337218","horario":"L-V: 8-20 HORAS; S: 8-14 HORAS","resp":"WALTER HUGO HINOJOSA CHAMORRO","latitud":"-12.037047","longitud":"-77.0598195"},{"codigo":"00006202","nombre":"CENTRO REF. ESP. ANTIRRABICO - ESPECIALIZADO EN ZO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"CALLE AUSTRIA N\u00ba 1300","telefono":"4256313","horario":"L-S: 8-19 HORAS; D: 8-14 HORAS","resp":"MONICA VILLANUEVA HERENCIA","latitud":"-12.049243","longitud":"-77.061595"},{"codigo":"00006203","nombre":"CENTRO REF. ESP.ETSS RAUL PATRUCCO PUIG","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"JR. HUANTA 927","telefono":"3289053","horario":"L-V: 8-19 HORAS; S: 8-14 HORAS","resp":"JULIO CESAR BAZAN PARIAN","latitud":"-12.053039","longitud":"-77.022893"},{"codigo":"00005823","nombre":"VILLA ESTELA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ANCON","direccion":"PROYECTO INTEGRAL MUNICIPAL PANAMERICANA NORTE SEC","telefono":"550-2116","horario":"8:00 - 20:00","resp":"OLGA TUTAYA QUISPE","latitud":"-11.76215539","longitud":"-77.15458139"},{"codigo":"00005824","nombre":"SAN JOSE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ANCON","direccion":"ESQ. CALLE N\u00ba 17 Y CALLE N\u00ba 9 URB. DE INTERES SOCI","telefono":"552-1630","horario":"8:00 - 14:00","resp":"VICTOR HUGO PEREZ APONTE","latitud":"-11.778565","longitud":"-77.162233"},{"codigo":"00005851","nombre":"FORTALEZA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"CL LOS VIRREYES S\/N URB. FORTALEZA DE VITARTE - AT","telefono":"3515376","horario":"08:00 - 20:00","resp":"ANA JUSTINA DIAZ BALTAZAR","latitud":"-12.030441","longitud":"-76.941047"},{"codigo":"00005884","nombre":"HORACIO ZEVALLOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"AV. J. ZUBIETA S\/N - AA.HH HORACIO ZEVALLOS","telefono":"3592250","horario":"08:00 - 20:00","resp":"RUBEN JOSE AYMAR CALDERON","latitud":"-12.023989","longitud":"-76.8364902"},{"codigo":"00005885","nombre":"SE\u00d1OR DE LOS MILAGROS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"AV. 15 DE JULIO S\/N \u00c1REA DE SERV. ZONA K HUAYCAN","telefono":"3716119","horario":"08:00 - 20:00","resp":"LUIS ALBERTO GOMEZ MORALES","latitud":"-12.023132","longitud":"-76.822417"},{"codigo":"00005926","nombre":"EL \u00caXITO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"MZ. F - LOTE 1 - URB. EL \u00c9XITO","telefono":"3562531","horario":"08:00 - 20:00","resp":"JIMMY CHRISTIAN PINEDA PACHAS","latitud":"-12.022003","longitud":"-76.900694"},{"codigo":"00005927","nombre":"SANTA CLARA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"AV. ESTRELLA S\/N SANTA CLARA CC.KM. 12","telefono":"3561887","horario":"08:00 - 20:00","resp":"ORLANDO TEODORICO GANOZA SOLANO","latitud":"-12.016158","longitud":"-76.884463"},{"codigo":"00005928","nombre":"MANYLSA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"MZ. F - LOTE 1 - COOP. MANYLSA - ATE","telefono":"3561672","horario":"08:00 - 20:00","resp":"LUIS ALLENDE MANCO MALPICA","latitud":"-12.032399","longitud":"-76.888784"},{"codigo":"00005929","nombre":"MICAELA BASTIDAS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"MZA. V- AAHH M. BASTIDAS - PARQUE CENTRAL","telefono":"3516107","horario":"08:00 - 20:00","resp":"JESUS ELIAS HUAPAYA VILLEGAZ","latitud":"-12.04457","longitud":"-76.931598"},{"codigo":"00005930","nombre":"ATE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"JR. PARURO 138 COOP. 27 DE ABRIL","telefono":"3491297","horario":"08:00 - 20:00","resp":"WILFREDO ESPINOZA ALTOS","latitud":"-12.055525","longitud":"-76.956251"},{"codigo":"00005931","nombre":"AMAUTA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"ZONA A - MZ. V3 LOTE 3 AAHH EL AMAUTA","telefono":"ACTUALIZAR","horario":"08:00 - 20:00","resp":"JOSE ANTONIO SERRANO LUQUILLAS","latitud":"-12.045987","longitud":"-76.897587"},{"codigo":"00005932","nombre":"SAN ANTONIO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"CALLE 7 ESQ.CALLE 8 S\/N - ASOC. POBLADORES SAN ANT","telefono":"351-6189","horario":"08:00 - 20:00","resp":"ALFREDO ERNESTO BEDOYA LAMA","latitud":"-12.030084","longitud":"-76.905498"},{"codigo":"00005933","nombre":"ALFA Y OMEGA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"AV. CENTRAL S\/N MZ.W - MZ.H PROGRAMA DE VIVIENDA A","telefono":"7783681","horario":"08:00 - 20:00","resp":"RONALD MANAY APAESTEGUI","latitud":"-12.014028","longitud":"-76.8537496"},{"codigo":"00005962","nombre":"GUSTAVO LANATTA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"JR.PUERTO ESPA\u00d1A MZ F2 LOTE 02 - SICUANI","telefono":"3265943","horario":"08:00 - 20:00","resp":"DORIS LUISA ZEVALLOS NALVARTE","latitud":"-12.069267","longitud":"-76.978802"},{"codigo":"00005963","nombre":"SALAMANCA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"CALLE LOS MOCHICAS 127-131 - SALAMANCA","telefono":"4360962","horario":"08:00 - 20:00","resp":"MARGOT ZEVALLOS SOLDEVILLA","latitud":"-12.071744","longitud":"-76.9863642"},{"codigo":"00005964","nombre":"EL BOSQUE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"PJ 3 DE MAYO 140 -MZ.B LOTE 12- URB. EL BOSQUE","telefono":"3265005","horario":"08:00 - 20:00","resp":"YRMA DORIS MEDRANO LANAZCA","latitud":"-12.063413","longitud":"-76.987062"},{"codigo":"00006849","nombre":"TUPAC AMARU","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"ATE","direccion":"MZ. D LOTE # 50 ZONA 2\u00b0 - AAHH TUPAC AMARU","telefono":"ACTUALIZAR","horario":"08:00 - 14:00","resp":"MIRIAM LUZ MARTINE SOTILLO ORTEGA","latitud":"-12.03843","longitud":"-76.90332"},{"codigo":"00005989","nombre":"GAUDENCIO BERNASCONI","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"BARRANCO","direccion":"AV. GRAU N\u00ba198","telefono":"01-2477780","horario":"08:00 - 20:00","resp":"PIERINA IDALIA QUEIROLO RIVERA","latitud":"-12.150538","longitud":"-77.020327"},{"codigo":"00005988","nombre":"ALICIA LASTRES DE LA TORRE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"BARRANCO","direccion":"MART\u00cdNEZ DE PINILLOS N\u00ba124 A","telefono":"01-2477779","horario":"8:00 - 20:00","resp":"ROSEMARY LILIA MOSCOSO CHIRINOS DE ROCA","latitud":"-12.144487","longitud":"-77.0225"},{"codigo":"00006184","nombre":"BRE\u00d1A","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"BRE\u00d1A","direccion":"JR. NAPO 1445","telefono":"4230432","horario":"L-V: 8-20 HORAS; S: 8-14 HORAS","resp":"JAVIER ROJAS NORIEGA","latitud":"-12.0569101","longitud":"-77.05366011"},{"codigo":"00006185","nombre":"CHACRA COLORADA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"BRE\u00d1A","direccion":"JR. CARHUAZ 509","telefono":"4231180 \/ 3321256","horario":"8-20 HORAS","resp":"ELSA BARDALES CANASSAS","latitud":"-12.05416","longitud":"-77.048088"},{"codigo":"00007138","nombre":"SAN BENITO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"MZ W1 LOTE 2 - SAN BENITO 4TA ETAPA","telefono":"951739026","horario":"8:00 - 14:00","resp":"DAVID MAMANI TAFUR","latitud":"-11.817892","longitud":"-77.047167"},{"codigo":"00007735","nombre":"JUAN PABLO II","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"JR. SAN FERNANDO MZ N LT. 11 - AAHH JUAN PABLO II","telefono":"01-550-2689","horario":"8:00 - 20:00","resp":"MARIO EGUZQUIZA CRIADO","latitud":"-11.8283536","longitud":"-77.0689618"},{"codigo":"00011891","nombre":"SU MAJESTAD HIROITO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"CALLE TOKIO MZ D LT 10 AAHH SU MAJESTAD HIROITO","telefono":"07 5584550","horario":"8:00 -14:00","resp":"WALTER JOHNNY MENDOZA QUISPE","latitud":"-11.881205","longitud":"-77.003039"},{"codigo":"00005822","nombre":"SAN PEDRO DE CARABAYLLO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"AAHH 28 DE JULIO MZ G LT. 9 KM 5 CARRETERA HUARANG","telefono":"794-4935","horario":"8:00 - 14:00","resp":"FELIX MACHACA MAMANI","latitud":"-11.854034","longitud":"-77.037398"},{"codigo":"00005734","nombre":"RAUL PORRAS BARRENECHEA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"JR AREQUIPA 4TA CUADRA S\/N - MZ 40 LOTE 17, PJ RAU","telefono":"5430940","horario":"08:00 - 20:00 HORAS","resp":"MERCEDES ELENA ESPINOZA YALAN","latitud":"-11.893302","longitud":"-77.024351"},{"codigo":"00005736","nombre":"LA FLOR","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"JR. PUNO S\/N ESQ. CON JR. 25 DE FEBRERO S\/N","telefono":"5432209","horario":"12 HORAS","resp":"DELGADO MATTOS LAURA INOCENCIA","latitud":"-11.896049","longitud":"-77.027365"},{"codigo":"00005737","nombre":"VILLA ESPERANZA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"JR 9 DE OCTUBRE CUADRA 2 S\/N - PPJJ VILLA ESPERANZ","telefono":"5470600","horario":"08:00 - 20:00 HORAS","resp":"JESUS SALCEDO PAREDES","latitud":"-11.88614","longitud":"-77.022109"},{"codigo":"00005738","nombre":"JORGE LINGAN","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"JR LOS ALHELIES S\/N - 1ER SECTOR EL PROGRESO","telefono":"5473685","horario":"8:00 - 14:00","resp":"EDINSON RAUL TELLEZ CAJAVILCA","latitud":"-11.883902","longitud":"-77.020303"},{"codigo":"00005739","nombre":"LUIS ENRIQUE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"AV MANUEL PRADO CUADRA 7 S\/N - EL PROGRESO 4TO SEC","telefono":"5473601","horario":"8:00 - 14:00","resp":"FIDEL HONORIO ESPINOZA DURAN","latitud":"-11.877284","longitud":"-77.00975"},{"codigo":"00005740","nombre":"PUNCHAUCA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"CARRETERA CANTA KM 25.5 - AA.HH. PUNCHAUCA","telefono":"945319142","horario":"8:00 - 14:00","resp":"MANUELA JESUS ORE VEGA","latitud":"-11.834307","longitud":"-77.000158"},{"codigo":"00005741","nombre":"CHOCAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CARABAYLLO","direccion":"KM 34 DE LA CARRETERA A CANTA (AV TUPAC AMARU KM 3","telefono":"94-5241918","horario":"8:00 - 14:00","resp":"JORGE LEON YUCRA CORNEJO","latitud":"-11.76641","longitud":"-76.977296"},{"codigo":"00005992","nombre":"ARMATAMBO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"CALLE LUCANAS MZ 1 LOTE 1 AAHH ARMATAMBO","telefono":"01-2524479","horario":"8:00 - 14:00","resp":"MIRTHA ESTER REYES SARAVIA","latitud":"-12.17592","longitud":"-77.022914"},{"codigo":"00006000","nombre":"SAN GENARO DE VILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. PRINCIPAL (ALTURA DE LA CALLE 12) AAHH SAN GEN","telefono":"01-2555018","horario":"24 HORAS","resp":"JOSE TRUJILLO HUACCHO","latitud":"-12.195123","longitud":"-77.021556"},{"codigo":"00006003","nombre":"TUPAC AMARU DE VILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. T\u00daPAC AMARU MZ. E, LT.1","telefono":"01-2583190","horario":"LUNES A SABADO 8:00 - 20:00","resp":"CARMELA PEREZ IRURETA","latitud":"-12.193434","longitud":"-76.981586"},{"codigo":"00005999","nombre":"DELICIAS DE VILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"JR. NEVADO CARHUAZO S\/N II ZONA DELICIAS DE VILLA","telefono":"01-2492149","horario":"24 HORAS","resp":"LARA ALEJOS MARIA ANGELICA","latitud":"-12.198726","longitud":"-76.993006"},{"codigo":"00006008","nombre":"PUESTO DE SALUD NUEVA CALEDONIA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. HUANCAVELICA MZ.E,LT.1 AAHH NUEVA CALEDONIA","telefono":"01-2551787","horario":"8:00 - 14:00","resp":"NEIL NICHOLL AQUIJE CHUMPITAZ","latitud":"-12.196945","longitud":"-77.026178"},{"codigo":"00006007","nombre":"VILLA VENTURO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"CALLE JAUJA S\/N.","telefono":"01-7156723\/01-7156722","horario":"8:00 - 14:00","resp":"MATTA SILVERIO KEITEL","latitud":"-12.187721","longitud":"-77.012808"},{"codigo":"00006006","nombre":"SANTA TERESA DE CHORRILLOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"PROLONG.AV.EL SOL S\/N AA.HH.SANTA TERESA DE CHORRI","telefono":"01-7156721-01-7156720","horario":"8:00 - 14:00","resp":"MARIA DEL CARMEN BAZUL GARCIA","latitud":"-12.187056","longitud":"-77.017862"},{"codigo":"00006009","nombre":"LOS INCAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"CALLE ISLAS GUYANAS MZ I-6 LOTE 30 URB. LOS CEDROS","telefono":"01-2555576","horario":"8:00 - 14:00","resp":"JOSE GABRIEL RENAN ALENCASTRE CALDERON","latitud":"-12.202143","longitud":"-77.013297"},{"codigo":"00006005","nombre":"MATEO PUMACAHUA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. MATEO PUMACAHUA MZ T S\/N LOTE 37 SECTOR 01","telefono":"01-2583439","horario":"7:30 - 14:00","resp":"DAVID ARTURO REYES HILARES","latitud":"-12.188659","longitud":"-76.980285"},{"codigo":"00006010","nombre":"DEFENSORES DE LIMA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AAHH DEFENSORES DE LIMA S\/N, FRENTE A LA MZ D","telefono":"01-7156805-01-7156806","horario":"8:00 - 14:00","resp":"ORIHUELA SIMON JEAN PIERRE","latitud":"-12.192323","longitud":"-76.976368"},{"codigo":"00006001","nombre":"VISTA ALEGRE DE VILLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"CALLE JOSE CARLOS MARIATEGUI S\/N","telefono":"01-2584749","horario":"8:00 - 14:00","resp":"JORGE LUIS MENDOZA ANCCANA","latitud":"-12.187046","longitud":"-76.992563"},{"codigo":"00006002","nombre":"PUESTO DE SALUD SANTA ISABEL DE VILLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. INDEPENDENCIA S\/N.AAHH SANTA ISABEL DE VILLA","telefono":"01-2584906","horario":"8:00 - 14:00","resp":"JOSE HECTOR PEREYRA VASQUEZ","latitud":"-12.200814","longitud":"-76.97836"},{"codigo":"00006004","nombre":"SAN JUAN DE LA LIBERTAD","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. 11 S\/N AA.HH. SAN JUAN DE LA LIBERTAD","telefono":"01-2582100","horario":"8:00 - 14:00","resp":"DAVID ARNALDO ANGELES TAPIA","latitud":"-12.190649","longitud":"-76.986773"},{"codigo":"00005990","nombre":"GUSTAVO LANATTA LUJAN","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"CHORRILLOS","direccion":"AV. DEFENSORES DEL MORRO (EX HUAYLAS) N\u00ba556","telefono":"01-4671313","horario":"8:00 - 20:00","resp":"HERNAN RAZO QUISPE","latitud":"-12.169569","longitud":"-77.024152"},{"codigo":"00005753","nombre":"A\u00d1O NUEVO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV FRANCISCO BOLOGNESI CUADRA 6 S\/N - PPJJ A\u00d1O NUE","telefono":"5421810","horario":"08:00 20:00 HORAS","resp":"JIMMY ANTHONY OSORIO VILLANUEVA","latitud":"-11.923687","longitud":"-77.038063"},{"codigo":"00005754","nombre":"COLLIQUE III ZONA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV SANTA ROSA CUADRA 9 S\/N - COLLIQUE 3ERA ZONA","telefono":"5581306","horario":"8:00 - 20:00","resp":"ANGELICA HAYDEE EVARISTO FELIPE","latitud":"-11.914529","longitud":"-77.026092"},{"codigo":"00005755","nombre":"LAURA RODRIGUEZ DULANTO DUKSIL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"CALLE 30 N\u00b0 150 (ANTES MZ R1 LOTE 2- PARCELA A) UR","telefono":"5570628","horario":"24 HORAS","resp":"NOE ABAD ECHE","latitud":"-11.915843","longitud":"-77.055374"},{"codigo":"00005756","nombre":"GUSTAVO LANATTA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"CALLE AREQUIPA S\/N CUADRA 2 - COLLIQUE 5TA ZONA","telefono":"5580204","horario":"8:00 - 20:00","resp":"SANTIAGO FERNANDO KOU IPARRAGUIRRE","latitud":"-11.914668","longitud":"-77.011154"},{"codigo":"00005757","nombre":"SANGARARA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR LA UNION (CON CALLE CUZCO) CUADRA 6 S\/N - ASOC.","telefono":"5421829","horario":"8:00 - 14-00","resp":"MARIA GRACIELA ORTIZ CASTILLO","latitud":"-11.918717","longitud":"-77.043859"},{"codigo":"00005758","nombre":"PRIMAVERA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"CALLE 8 S\/N - ESQ. MZ. Q, COOP. PRIMAVERA Y MZ. Z,","telefono":"5395007","horario":"LUN-SAB: 8 A 14 HORAS","resp":"JULIO CESAR MOGOLLON RODRIGUEZ","latitud":"-11.923264","longitud":"-77.05649"},{"codigo":"00005759","nombre":"MILAGRO DE JESUS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV. SANTO TORIBIO DE MOGROVEJO, MZ L, LOTE 10 - AA","telefono":"5582656","horario":"8:00 - 14:00","resp":"CLELIA NORIEGA ALTAMIRANO","latitud":"-11.918381","longitud":"-77.026246"},{"codigo":"00005760","nombre":"SAN CARLOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR. SAN MATEO CUADRA 3 S\/N - ASOCIACION SAN CARLOS","telefono":"5434891","horario":"08:00 - 14:00 HORAS","resp":"LUIS ENRIQUE PEDREROS TINCOPA","latitud":"-11.90846","longitud":"-77.041483"},{"codigo":"00005761","nombre":"LOS GERANIOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR. MARIANO CONDORCANQUI S\/N","telefono":"5440442","horario":"8:00 - 14:00","resp":"MADELEINE ESPINOLA LUYO","latitud":"-11.896455","longitud":"-77.04321"},{"codigo":"00005762","nombre":"11 DE JULIO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"ASENTAMIENTO HUMANO 11 DE JULIO S\/N","telefono":"5423117","horario":"8:00 - 14:00","resp":"JOHNNY CALDERON VARGAS","latitud":"-11.930841","longitud":"-77.037336"},{"codigo":"00005763","nombre":"CARLOS A. PROTZEL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV BELAUNDE ESTE - 2DA CUADRA S\/N","telefono":"5412433","horario":"08:00 - 20:00 HORAS","resp":"JORGE ZAVALETA RIVAS","latitud":"-11.940842","longitud":"-77.047884"},{"codigo":"00005764","nombre":"CARMEN ALTO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV 3 DE OCTUBRE 1990 AAHH CARMEN ALTO","telefono":"5414107","horario":"08:00 - 20:00 HORAS","resp":"CRISTIAN PRIETO ARANGOITIA","latitud":"-11.945204","longitud":"-77.030917"},{"codigo":"00005765","nombre":"CARMEN MEDIO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR. CAHUIDE S\/N CDRA 8 CARMEN MEDIO","telefono":"5411225","horario":"24 HORAS","resp":"GLADYS VERONIKA BECERRA RICCI","latitud":"-11.94111","longitud":"-77.040079"},{"codigo":"00005766","nombre":"SANTA LUZMILA I","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV GUILLERMO DE LA FUENTE CUADRA 2 S\/N - URB SANTA","telefono":"5368003","horario":"8:00 - 20:00","resp":"MIGUEL EDUARDO ALVARADO ESPINOZA","latitud":"-11.941881","longitud":"-77.063597"},{"codigo":"00005767","nombre":"COMAS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR PUNO 3ERA CUADRA, S\/N","telefono":"5425557","horario":"08:00 20:00 HORAS","resp":"GLADYS ROSA JAVE MEDINA","latitud":"-11.953568","longitud":"-77.049072"},{"codigo":"00005768","nombre":"CARLOS PHILLIPS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"CALLE BRASILIA CUADRA 1 S\/N - URB EL PARRAL","telefono":"5250769","horario":"08:00 - 20:00 HORAS","resp":"CARLOS MIGUEL RAVILLET SUAREZ","latitud":"-11.959672","longitud":"-77.057458"},{"codigo":"00005769","nombre":"HUSARES DE JUNIN","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR HUSARES DE JUNIN S\/N - URB HUAQUILLAY 2DA ETAPA","telefono":"5363998","horario":"08:00 - 14:00","resp":"ANDRES ALEJANDRO ELIAS JUSTINO","latitud":"-11.935799","longitud":"-77.05173"},{"codigo":"00005770","nombre":"SE\u00d1OR DE LOS MILAGROS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV 3 DE OCTUBRE CUADRA 4 - VILLA SE\u00d1OR DE LOS MILA","telefono":"5410418","horario":"08:00 - 14:00 HORAS","resp":"LIZ DAYSI CHAVEZ GALLEGOS","latitud":"-11.941405","longitud":"-77.045135"},{"codigo":"00005771","nombre":"LA PASCANA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR. ABRAHAM VALDELOMAR CDRA. 2 S\/N","telefono":"5414418","horario":"8:00-14:00","resp":"AMALIA YSABEL VALERIANO ARTEAGA","latitud":"-11.936369","longitud":"-77.04651"},{"codigo":"00005772","nombre":"SANTA LUZMILA II","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"AV. 22 DE AGOSTO N\u00b0 1001- URB SANTA LUZMILA II ETA","telefono":"5371202","horario":"8:00 - 14:00","resp":"RICARDO RIOS ALTAMIRANO","latitud":"-11.947575","longitud":"-77.058918"},{"codigo":"00005773","nombre":"CLORINDA MALAGA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"PSJE. ATAHUALPA S\/N - VILLA CLORINDA","telefono":"5258070","horario":"08:00 - 14:00 HORAS","resp":"EDWARDS ARMAULIA QUISPE","latitud":"-11.966444","longitud":"-77.053553"},{"codigo":"00012668","nombre":"NUEVA ESPERANZA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JIRON SANTOS CHOCANO S\/N AA.HH. NUEVA ESPERANZA","telefono":"5202624","horario":"8:00 - 14:00","resp":"YONEL TOLOMEO CONDEZO VALDERRAMA","latitud":"-11.922877","longitud":"-77.021297"},{"codigo":"00007684","nombre":"EL ALAMO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"CALLE G - MZ Y, LOTE 1 - URB EL ALAMO 1ERA ETAPA","telefono":"5374499","horario":"8 A 14 HORAS","resp":"ADY ARGUELLES ATAHUALPA","latitud":"-11.933205","longitud":"-77.067847"},{"codigo":"00006886","nombre":"SANTIAGO APOSTOL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"COMAS","direccion":"JR DOS DE MAYO CUADRA 7 S\/N","telefono":"ACTUALIZAR","horario":"06 HORAS","resp":"GRETELL IRINA MOLINA CALDERON","latitud":"-11.957279","longitud":"-77.043363"},{"codigo":"00013261","nombre":"CERRO EL AGUSTINO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"AV. EL AGUSTINO S\/N PARTE ALTA CERRO EL AGUSTINO A","telefono":"0","horario":"8:00-14:00","resp":"AQUELINA IRENE CANO ENRIQUEZ","latitud":"-12.057135","longitud":"-77.001847"},{"codigo":"00005967","nombre":"7 DE OCTUBRE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"AV.SANTA ROSA S\/N VI ZONA - AAHH 7 DE OCTUBRE","telefono":"3264766","horario":"08:00 - 20:00","resp":"LUIS ANGEL MATOS VILCHEZ","latitud":"-12.055972","longitud":"-76.994256"},{"codigo":"00005965","nombre":"SANTA MAGDALENA SOFIA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"AV. GARCILAZO DE LA VEGA CDRA. 3 - SAN PEDRO","telefono":"3236296","horario":"08:00 - 20:00","resp":"JUAN CARLOS LOYOLA IRRIBARREN","latitud":"-12.060737","longitud":"-77.00372"},{"codigo":"00005918","nombre":"MADRE TERESA CALCUTA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"AV. INCA RIPAC N\u00b0 229 ( ALT. 8 Y 9 DE RIVA AG\u00dcERO)","telefono":"3271355 \/ 3271920","horario":"08:00 - 20:00","resp":"EDWIN HERRERA GONI","latitud":"-12.051319","longitud":"-77.004293"},{"codigo":"00005919","nombre":"CATALINA HUANCA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"CALLE GONZ\u00c1LES DE FANNING 180 ( CERCA AL CE 076)EL","telefono":"3270971","horario":"08:00 - 20:00","resp":"ESPINOZA BRAVO ESTHER CARIDAD","latitud":"-12.051292","longitud":"-76.995577"},{"codigo":"00005920","nombre":"BETHANIA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"LOS ARTESANOS 166 ASOC.VIV. BETHANIA (CERCA DEL CE","telefono":"3851197","horario":"08:00 - 20:00","resp":"SEMINARIO SILVA CRISTINA","latitud":"-12.027725","longitud":"-76.992971"},{"codigo":"00005921","nombre":"ANCIETA BAJA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"AGRUPACION FAMILIAR LOS JARDINES - EX ANCIETA BAJA","telefono":"3853270","horario":"08:00 - 20:00","resp":"LEONARDO AURELIO VILLA MEDINA","latitud":"-12.03129","longitud":"-77.008401"},{"codigo":"00005922","nombre":"PRIMAVERA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"URB. PRIMAVERA CALLE 23 DE SETIEMBRE S\/N","telefono":"3853072","horario":"08:00 - 20:00","resp":"PEREZ LAZO PATRICIA ISABEL","latitud":"-12.034701","longitud":"-77.005868"},{"codigo":"00005923","nombre":"EL AGUSTINO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"EL AGUSTINO","direccion":"ARACELI CATALAN - ESQ. INDEPENDIENTE (PIE DEL CERR","telefono":"3277843","horario":"08:00 - 20:00","resp":"GLENDHA MARIA PITA DEZA","latitud":"-12.053588","longitud":"-77.002445"},{"codigo":"00005786","nombre":"ERMITA\u00d1O ALTO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"AV LOS JAZMINES S\/N, PARADERO 8 - ERMITA\u00d1O ALTO","telefono":"5222582","horario":"8:00 - 20:00 HORAS","resp":"EDITH AMELIA CABALLERO CAMONES","latitud":"-11.9995337","longitud":"-77.0448736"},{"codigo":"00005787","nombre":"ERMITA\u00d1O BAJO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"JR. LOS PINOS S\/N","telefono":"5212927","horario":"12 HORAS","resp":"MIREYA GIOVANNA ACOSTA MIRAVAL","latitud":"-11.9975582","longitud":"-77.0544086"},{"codigo":"00005788","nombre":"EL CARMEN","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"JR 23 DE DICIEMBRE S\/N - AAHH VILLA EL CARMEN","telefono":"3817299","horario":"08:00 - 14:00","resp":"MARINO HERMES ESCALANTE ESPINOZA","latitud":"-12.0171219","longitud":"-77.0476186"},{"codigo":"00005789","nombre":"LOS QUECHUAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"JR LOS QUECHUAS CUADRA 2 S\/N - 3ER SECTOR INDEPEND","telefono":"5218760","horario":"8:00 - 14:00 HORAS","resp":"ROSALYN MARLENI BENAVIDES AVILA","latitud":"-11.9904744","longitud":"-77.0422087"},{"codigo":"00005790","nombre":"MILAGRO DE LA FRATERNIDAD","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"ESQUINA DE AV. LOS HEROES CON AV. ALVINO HERRERA","telefono":"5347777","horario":"08:00 - 14:00 HORAS","resp":"IVETT PAOLA MONTES PALOMINO","latitud":"-12.011586","longitud":"-77.049029"},{"codigo":"00005792","nombre":"TAHUANTINSUYO ALTO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"AV HERMANOS AYAR 2DA CUADRA S\/N - TAHUANTINSUYO AL","telefono":"5263956","horario":"08:00 - 14:00","resp":"JOSE ANTONIO RIOS ROSALES","latitud":"-11.979094","longitud":"-77.0398"},{"codigo":"00005793","nombre":"TUPAC AMARU","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"JR CAJABAMBA S\/N, 3ERA CUADRA - URB POPULAR TUPAC ","telefono":"5260465","horario":"08:00 - 14:00","resp":"SAUL ENRIQUE QUISPE COAQUIRA","latitud":"-11.972277","longitud":"-77.045367"},{"codigo":"00005794","nombre":"LAS AMERICAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"JR COLLASUYO CUADRA 2 S\/N - 1ERA ZONA TAHUANTINSUY","telefono":"5263393","horario":"8:00 - 14:00","resp":"ZOILA ESTHER TOSCANO MENESES","latitud":"-11.987551","longitud":"-77.054111"},{"codigo":"00005795","nombre":"VICTOR RAUL HAYA DE LA TORRE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"CALLE A MZ 2 LOTE 3 - ASOC VIV VICTOR RAUL HAYA DE","telefono":"2011340","horario":"08:00 - 14:00 HORAS","resp":"RICARDO URBINA MARTINEZ","latitud":"-11.977664","longitud":"-77.057135"},{"codigo":"00005796","nombre":"JOSE OLAYA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"INDEPENDENCIA","direccion":"AV 4 DE NOVIEMBRE S\/N, AAHH JOSE OLAYA - URB PAYET","telefono":"5507215","horario":"6 HORAS","resp":"JACQUELINE ORRILLO VIACAVA","latitud":"-11.9677323","longitud":"-77.0391295"},{"codigo":"00006201","nombre":"JESUS MARIA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"JESUS MARIA","direccion":"AV. ARNALDO M\u00c1RQUEZ 1750","telefono":"3287304 \/ 3288249","horario":"L-S: 8-20 HORAS","resp":"NICOLAS ALFONSO RETO TORRES","latitud":"-12.07791","longitud":"-77.053282"},{"codigo":"00006616","nombre":"VI\u00d1A ALTA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA MOLINA","direccion":"AV. LOS OLIVOS S\/N 2 DA ETAPA -COSTADO MERCADO VI\u00d1","telefono":"3652308","horario":"08:00 - 14:00","resp":"MORALES RODRIGUEZ JULIO ENRIQUE","latitud":"-12.095915","longitud":"-76.941224"},{"codigo":"00005903","nombre":"LA MOLINA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA MOLINA","direccion":"CALLE EL HARAS S\/N ( COST. CUNA MUNICIPAL) ESQ.MAN","telefono":"3680119","horario":"8:00 - 19:00","resp":"SEKULA DELGADO ANA KATICA","latitud":"-12.07884185","longitud":"-76.91693161"},{"codigo":"00005904","nombre":"MUSA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA MOLINA","direccion":"LOS TULIPANES S\/N ( CTDO. PQUE MUNICIPAL)","telefono":"3681281","horario":"08:00 - 20:00","resp":"RAMIREZ BORELLY ELIZABETH ELENA","latitud":"-12.1095837","longitud":"-76.9267696"},{"codigo":"00005906","nombre":"MATAZANGO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LA MOLINA","direccion":"CALLE CAMINO REAL MZ.R S\/N AAHH MATAZANGO","telefono":"436-0953","horario":"08:00 - 02:00","resp":"YABAR BORNAZ KATHYA","latitud":"-12.070126","longitud":"-76.968033"},{"codigo":"00005907","nombre":"PORTADA DEL SOL","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LA MOLINA","direccion":"AV. PRINCIPAL S\/N MZ. E- 6 LT. 3 - 2DA ETAPA URB. ","telefono":"3654263","horario":"08:00 - 14:00","resp":"DEL AGUILA DE CIEZA DE LEON MARICELA","latitud":"-12.110002","longitud":"-76.938071"},{"codigo":"00006170","nombre":"MAX ARIAS SCHREIBER","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA VICTORIA","direccion":"JR. ANTONIO RAYMONDI 220 PRIMER PISO","telefono":"4234865 \/ 4336213","horario":"L-V: 8-19 HORAS; S: 8-14 HORAS","resp":"ROSA BEDOYA RUBIO","latitud":"-12.061191","longitud":"-77.032089"},{"codigo":"00006173","nombre":"EL PINO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA VICTORIA","direccion":"AV. FLORAL 744","telefono":"4740671 \/ 3234926","horario":"L-V: 8-18 HORAS; S: 8-14 HORAS","resp":"SIXTO DEL CARPIO HUAQUIPACO","latitud":"-12.067161","longitud":"-76.998522"},{"codigo":"00006174","nombre":"CLAS CERRO EL PINO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LA VICTORIA","direccion":"SECTOR 19 LOTE 14 AAHH CERRO EL PINO","telefono":"323-7136","horario":"7:00 - 14:00","resp":"TANIA RODRIGUEZ DEL AGUILA","latitud":"-12.066686","longitud":"-77.001814"},{"codigo":"00006176","nombre":"SAN COSME","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LA VICTORIA","direccion":"AV. BAUZATE Y MEZA - ALTURA DE LA CUADRA 23","telefono":"3231889 \/ 3243431","horario":"L-V: 8-20 HORAS; S: 8-14 HORAS","resp":"EDUARDO RUMALDO GOMEZ","latitud":"-12.062152","longitud":"-77.006825"},{"codigo":"00006195","nombre":"LINCE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LINCE","direccion":"JR. MANUEL CANDAMO 495","telefono":"4710301 \/ 4712588","horario":"L-V: 8-17 HORAS; S: 8-13 HORAS","resp":"JOSE LUIS A\u00d1ORGA MOGRUSA","latitud":"-12.081908","longitud":"-77.031952"},{"codigo":"00005810","nombre":"SAGRADO CORAZON DE JESUS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"PLAZA CIVICA S\/N - PROYECTO INTEGRAL CUETO FERNAND","telefono":"5226756","horario":"07:00 - 20:00 HORAS","resp":"PIERRE PAUL PACHECO PAREDES","latitud":"-11.982001","longitud":"-77.076175"},{"codigo":"00005813","nombre":"RIO SANTA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"CALLE 11 S\/N - ASOCIACION DE VIVIENDA RIO SANTA","telefono":"5288305","horario":"LUN-SAB: 8 A 14 HORAS \/ MAR Y JUEV: 14 A 20 HORAS","resp":"JOSE JOAQUIN RIOS HERNANDEZ","latitud":"-11.948639","longitud":"-77.077903"},{"codigo":"00005797","nombre":"SAN MARTIN DE PORRES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ 143-A S\/N, AV BETANCOURT - AAHH SAN MARTIN DE P","telefono":"6236897","horario":"LUN-SAB: 8 A 20 HORAS","resp":"JAIME RAMOS MAGUI\u00d1A","latitud":"-11.959745","longitud":"-77.080717"},{"codigo":"00005798","nombre":"LAURA CALLER","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ 10-A LOTE S\/N - ZONA 5 AAHH LAURA CALLER","telefono":"5286595","horario":"LUN-SAB 8 A 22 HRS \/ DOM-FER 8 A-14 HRS","resp":"RUBEN JOSE VENTURA FLORES","latitud":"-11.970491","longitud":"-77.078184"},{"codigo":"00005800","nombre":"ENRIQUE MILLA OCHOA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ 124, LT S\/N - COMIT\u00c9 8, AAHH ENRIQUE MILLA OCHO","telefono":"5283307","horario":"8:00 - 20:00","resp":"EBERTH ALBERTO TIRADO CAICAY","latitud":"-11.956663","longitud":"-77.083013"},{"codigo":"00005801","nombre":"LOS OLIVOS DE PRO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ H1 LOTE S\/N, SECTOR A - AAHH LOS OLIVOS DE PRO","telefono":"5283152","horario":"12 HORAS","resp":"RUTH DE LOS ANGELES FLORES ESCOBAR","latitud":"-11.951182","longitud":"-77.0845"},{"codigo":"00005802","nombre":"LOS OLIVOS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"JR SANTA CRUZ DE PACHACUTEC, 2DA CUADRA S\/N - URB ","telefono":"522-2309","horario":"06 HORAS","resp":"JOSE MANUEL CORNEJO CHAVEZ","latitud":"-11.992863","longitud":"-77.065462"},{"codigo":"00005803","nombre":"PRIMAVERA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ F LOTE 11 URB PRIMAVERA","telefono":"5331346","horario":"LUN-SAB 08:000 A 20:00 HORAS","resp":"ADRIANA MERCEDES LOZANO SUING","latitud":"-12.008672","longitud":"-77.07069"},{"codigo":"00005806","nombre":"VILLA DEL NORTE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"MZ V LOTE 05 - URB.VILLA DEL NORTE","telefono":"5286897","horario":"LUN-SAB: 8 A 20 HORAS","resp":"JORGE GARRIDO PEREZ","latitud":"-11.971357","longitud":"-77.069631"},{"codigo":"00005807","nombre":"CARLOS CUETO FERNANDINI","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LOS OLIVOS","direccion":"AV. LAS PALMERAS, CUADRA 45 S\/N","telefono":"5213440","horario":"08:00 - 20:00 HORAS","resp":"SANDRA MILAGROS OSORIO SAN MARTIN","latitud":"-11.981619","longitud":"-77.07172"},{"codigo":"00005869","nombre":"VILLA DEL SOL","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"MZ. J, LOTE 4 COOP. VILLA DEL SOL","telefono":"3600044","horario":"08:00 - 02:00","resp":"ROCIO JIMENEZ SUAREZ","latitud":"-11.96432","longitud":"-76.9343332"},{"codigo":"00005944","nombre":"VIRGEN DEL CARMEN - LA ERA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"MZ D LOTE 2 C.POB. VIRGEN DEL CARMEN LA ERA-LURIGA","telefono":"3590344","horario":"08:00 - 02:00","resp":"CONDORI MAMANI ANGEL ERNESTO","latitud":"-11.984226","longitud":"-76.836307"},{"codigo":"00005897","nombre":"JICAMARCA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"AV.13 DE JUNIO MZ \u00d1 LOTE 2-OVALO CENTRAL JICAMARCA","telefono":"3711845 - 3565818","horario":"08:00 - 20:00","resp":"DE LA CRUZ VALLEJOS ARMANDO","latitud":"-11.9803592","longitud":"-76.9430327"},{"codigo":"00005899","nombre":"VIRGEN DEL ROSARIO CARAPONGO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"URB.SAN ANTONIO MZ Y LT 19","telefono":"7911955","horario":"08:00 - 02:00","resp":"BUENO LEON PATRICIA","latitud":"-12.002013","longitud":"-76.875736"},{"codigo":"00005900","nombre":"VILLA LETICIA DE CAJAMARQUILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"AAHH PAMPA LOS OLIVARES-VILLA LETICIA-MZ K1 LOTE 9","telefono":"3564372","horario":"08:00 - 18:00","resp":"YNOSTROZA QUIROZ NANCY PATRICIA","latitud":"-11.9662957","longitud":"-76.8833177"},{"codigo":"00005901","nombre":"ALTO PERU","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"AAHH SANTA CRUZ DE HUACHIPA MZ B LT.1 - LURIGANCHO","telefono":"7804156","horario":"08:00 - 02:00","resp":"RUMALDO FERNANDEZ LITA LUCY","latitud":"-12.000425","longitud":"-76.924188"},{"codigo":"00005902","nombre":"NIEVERIA DEL PARAISO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"EX FUNDO AGRICOLA NIEVERIA LOTE 62-B LT.1","telefono":"7868953 \/ 988364857","horario":"08:00 - 02:00","resp":"FIGUEROA BENAVENTE VERONICA JENNIFER","latitud":"-11.976816","longitud":"-76.907971"},{"codigo":"00010093","nombre":"VILLA MERCEDES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"AAHH EL PARAISO DE CAJAMARQUILLA, MZ. L, LOTE 20 -","telefono":"4079329","horario":"08:00 - 14:00","resp":"UCHAZARA UCHASARA EVI MARILY","latitud":"-11.996305","longitud":"-76.922245"},{"codigo":"00006735","nombre":"CASA HUERTA LA CAMPI\u00d1A","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIGANCHO (CHOSICA)","direccion":"MZ A LT.13-14 SECT B AAHH CASA HUERTA LA CAMPI\u00d1A","telefono":"NO CUENTA","horario":"08:00 - 02:00","resp":"JUSTO GAVINO CESAR ELIAS","latitud":"-11.975607","longitud":"-76.916904"},{"codigo":"00006080","nombre":"JULIO C TELLO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIN","direccion":"AV. LAS ACASIAS MZ B LT 12 ST 1 JULIO C. TELLO","telefono":"01-4300968","horario":"08:00 - 20:00","resp":"YESICA YASMINA ROJAS VIZARRETA","latitud":"-12.2507888","longitud":"-76.8983297"},{"codigo":"00006082","nombre":"VILLA ALEJANDRO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"LURIN","direccion":"MZ L- LOTE 31- AAHH VILLA ALEJANDRO","telefono":"2935539","horario":"12 HRS \/ 08:00 A 20:00","resp":"SEFERINA LUCIA QUISPE HUARANCA","latitud":"-12.236204","longitud":"-76.909544"},{"codigo":"00006083","nombre":"BUENA VISTA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIN","direccion":"PROLONG. ALFONSO UGARTE BUENA VISTA BAJA S\/N","telefono":"NO TIENE","horario":"08:00 - 14:00","resp":"JACKELINE VANESSA SERRANO PRECIADO","latitud":"-12.256819","longitud":"-76.874868"},{"codigo":"00016852","nombre":"MARTHA MILAGROS BAJA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"LURIN","direccion":"AV. LOS CIPRECES MZ B , LOTE 01 , MARTHA MILAGROS ","telefono":"996937650","horario":"8:00-14:00","resp":"JOSE LUIS CHACON ANTEZANA","latitud":"-12.233266","longitud":"-76.903259"},{"codigo":"00006200","nombre":"RED DE SALUD LIMA CIUDAD","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"MIRAFLORES","direccion":"AV. JOSE PARDO N\u00b0 796","telefono":"4466746 \/ 2417507 \/ 2438911","horario":"L-V: 8-20 HORAS; S: 8-14 HORAS","resp":"WILLIAM ERNESTO GARAY LOPEZ","latitud":"-12.118825","longitud":"-77.036721"},{"codigo":"00015075","nombre":"CENTRO DE SALUD CLAS JUAN PABLO II","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"MANZANA K8 LOTE 5B, SECTOR LOS JARDINES HUERTOS DE","telefono":"01-953952772","horario":"LUNES A SABADO: 8:00-14 HORAS","resp":"JUAN VICTOR FABIAN GAVE","latitud":"-12.109636","longitud":"-76.862018"},{"codigo":"00006090","nombre":"CENTRO DE SALUD PACHACAMAC","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV. COLONIAL S\/N Y ESQ. CASTILLA","telefono":"2311006","horario":"24 HORAS","resp":"ISABEL CANDELARIA ATAUJE GOMEZ DE VASQUEZ CAICEDO","latitud":"-12.227991","longitud":"-76.860356"},{"codigo":"00006091","nombre":"MANCHAY ALTO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV LAS CASUARINAS MZ E LT 18 CENTRO POBLADO RURAL ","telefono":"989068897","horario":"06 HORAS \/ 08:00 A 14:00","resp":"MARIELA GALVEZ MONTOYA","latitud":"-12.166548","longitud":"-76.8585"},{"codigo":"00006092","nombre":"CENTRO DE SALUD PORTADA DE MANCHAY","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"CALLE 7 ESQ. CALLE 4 MZ F LT 11 AAHH PORTADA DE MA","telefono":"3456410","horario":"24 HRS","resp":"RICARDO DOMINGO GASPAR QUEZADA","latitud":"-12.088955","longitud":"-76.881925"},{"codigo":"00006093","nombre":"VILLA LIBERTAD","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"JR HUANUCO S\/N CENTRO POBLADO RURAL CASICA-VILLA L","telefono":"2311798","horario":"06 HORAS \/ 08:00 A 14:00","resp":"BLANCA ELIZABETH ASENJO FERNANDEZ","latitud":"-12.1625028","longitud":"-76.846993"},{"codigo":"00006094","nombre":"PAMPA GRANDE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"CENTRO POBLADO RURAL PAMPA GRANDE","telefono":"NO TIENE","horario":"06 HORAS \/ 08:00 A 14:00","resp":"JAVIER ALEJANDRO ESPINOZA TAVERA","latitud":"-12.239797","longitud":"-76.870792"},{"codigo":"00006095","nombre":"PUESTO DE SALUD QUEBRADA VERDE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV. ROQUE SAENZ PE\u00d1A MZ. I LOTE 13","telefono":"01-2311006","horario":"08:00 A 14:00","resp":"ERICSON BUSTINZA ZUASNABAR","latitud":"-12.210439","longitud":"-76.876978"},{"codigo":"00006096","nombre":"GUAYABO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV SAN JUAN MZ H LT 2 CENTRO POBLADO RURAL GUAYABO","telefono":"NO TIENE","horario":"06 HORAS \/ 08:00 A 14:00","resp":"ARTURO MAXIMO ROJO SANTAMARIA","latitud":"-12.199031","longitud":"-76.873028"},{"codigo":"00006097","nombre":"PICAPIEDRA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV REAL MZ J LT 8 CENTRO POBLADO RURAL PICAPIEDRA-","telefono":"NO TIENE","horario":"06 HORAS \/ 08:00 A 14:00","resp":"MYRNA VIOLETA HERRERA FIESTAS","latitud":"-12.187477","longitud":"-76.86773"},{"codigo":"00006098","nombre":"TAMBO INGA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV VICTOR MALASQUEZ CENTRO POBLADO RURAL TAMBO ING","telefono":"989068890","horario":"8:00-14:00","resp":"DANIEL ALEJANDRO OLIVOS BAYETO","latitud":"-12.147332","longitud":"-76.841081"},{"codigo":"00006099","nombre":"CARDAL","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"CENTRO POBLADO RURAL CARDAL - PACHACAMAC","telefono":"989068892","horario":"06 HORAS \/ 08:00 A 14:00","resp":"ANTONIO JOSE ESPINOZA MEDINA","latitud":"-12.181302","longitud":"-76.85133"},{"codigo":"00006101","nombre":"COLLANAC","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"AV. VICTOR MALASQUEZ KM 5.5 SECTOR 24 DE JUNIO -CO","telefono":"NO TIENE","horario":"LUNES A SABADO: 8:00-14:00 HORAS.","resp":"ROCIO IPARRAGUIRRE ROSAS","latitud":"-12.119219","longitud":"-76.870924"},{"codigo":"00006102","nombre":"HUERTOS DE MANCHAY","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"MZ T LOTE S\/N SECTOR RINCONADA ALTA","telefono":"3455248","horario":"8:00-14:00","resp":"MARIBEL APAZA MAMANI","latitud":"-12.116694","longitud":"-76.870047"},{"codigo":"00006103","nombre":"PARQUES DE MANCHAY","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PACHACAMAC","direccion":"CARRETERA CIENEGUILLA KM 21-MZ 1 LT 12-13 AAHH PAU","telefono":"01-3455248","horario":"LUNES A SABADO:8:00-14:00","resp":"MARLENE ZAMORA GONZALES","latitud":"-12.0849835","longitud":"-76.8770521"},{"codigo":"00010633","nombre":"JESUS OROPEZA CHONTA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PUENTE PIEDRA","direccion":"CALLE 2 - MZ. E, LOTE 9-10 - AA.HH. JES\u00daS OROPEZA ","telefono":"5501044","horario":"08:00 - 14:00","resp":"HANS ROJAS GARCIA","latitud":"-11.826171","longitud":"-77.112544"},{"codigo":"00005815","nombre":"SAGRADO CORAZON DE JESUS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"PUENTE PIEDRA","direccion":"AV INDEPENDENCIA S\/N - AAHH LAS ANIMAS","telefono":"551-0730","horario":"8:00 - 14:00","resp":"JUBERT AGUILAR CALDERON","latitud":"-11.9083271","longitud":"-77.0777862"},{"codigo":"00005818","nombre":"JERUSALEN","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PUENTE PIEDRA","direccion":"AV. SAN JUAN S\/N - AA.HH. JERUSALEN","telefono":"550-0905","horario":"8:00 - 20:00","resp":"CONRADO RODRIGUEZ VELASQUEZ","latitud":"-11.828067","longitud":"-77.117294"},{"codigo":"00005819","nombre":"LADERAS DE CHILLON","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PUENTE PIEDRA","direccion":"AV V\u00cdA DE INTEGRACION S\/N - MZ C1 LT 3A, 1ERA. EXP","telefono":"551-0159","horario":"8:00 - 20:00","resp":"JOHNATAN PALOMINO CARDOZO","latitud":"-11.921142","longitud":"-77.084393"},{"codigo":"00005820","nombre":"LA ENSENADA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"PUENTE PIEDRA","direccion":"JR. JACARAND\u00c1 S\/N - AA.HH. LA ENSENADA","telefono":"5510822","horario":"8:00 - 20:00","resp":"RONY ZEGARRA BENAVENTE","latitud":"-11.931696","longitud":"-77.095791"},{"codigo":"00005752","nombre":"CAQUETA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"AV. LOS PROCERES 1051","telefono":"4812129","horario":"LUN-SAB: 8 A 14 HORAS","resp":"LUCY CONSUELO CHANG TORRES","latitud":"-12.031239","longitud":"-77.043521"},{"codigo":"00005638","nombre":"LEONCIO PRADO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"AV ALCAZAR CUADRA 3 - URB LEONCIO PRADO","telefono":"482-2474","horario":"LUN-SAB 08 A 14 HORAS","resp":"MARIELA LILIANA SEGUIL LEGUA","latitud":"-12.031604","longitud":"-77.030361"},{"codigo":"00005639","nombre":"SAN JUAN DE AMANCAES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"AAHH SAN JUAN DE AMANCAES 2DA ZONA","telefono":"3819931","horario":"LUN-SAB 8 A 14 HORAS \/ MAR Y JUEV 14 A 20 HORAS","resp":"ELVIRA ANTONIA CHAUCA RETUERTO","latitud":"-12.016292","longitud":"-77.026934"},{"codigo":"00005640","nombre":"CIUDAD Y CAMPO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"JR. JACINTO BENAVENTE N\u00ba 264 - ASOCIACION CIUDAD Y","telefono":"4811272","horario":"8 A 14 HORAS Y DE 14 A 16 HORAS","resp":"RAUL AUGUSTO MANTILLA ALAYO","latitud":"-12.02413","longitud":"-77.028148"},{"codigo":"00005641","nombre":"FLOR DE AMANCAES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"PROLONGACION FLOR DE AMANCAES S\/N","telefono":"3814399","horario":"LUN-SAB: 8 A 20 HORAS","resp":"PAUL CASTRO QUINCHO","latitud":"-12.0081537","longitud":"-77.035279"},{"codigo":"00005642","nombre":"VILLA LOS ANGELES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"AV. LAS MERCEDES N\u00ba 209 - PP.JJ. LOS ANGELES","telefono":"4810310","horario":"LUN-SAB: 8 A 14 HORAS","resp":"ENRIQUE RAMOS LOAYZA","latitud":"-12.0237016","longitud":"-77.0254725"},{"codigo":"00005643","nombre":"MARISCAL CASTILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"RIMAC","direccion":"PROLONG. SANCHO DAVILA S\/N (JR PEDRO ARZOLA S\/N) -","telefono":"3816345","horario":"LUN-SAB: 8 A 14 Y DE 14 A 20 HORAS","resp":"RENIER CESAR CRUZ BACA","latitud":"-12.0174713","longitud":"-77.0317467"},{"codigo":"00006181","nombre":"SAN JUAN MASIAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN BORJA","direccion":"JR DE LA HISTORIA MZ C LOTE 19 AAHH SAN JUAN MASIA","telefono":"2248718","horario":"L-S: 8-14 HORAS","resp":"JOOL ALARCON QUISPE","latitud":"-12.084119","longitud":"-77.002534"},{"codigo":"00006183","nombre":"CENTRO DE SALUD TODOS LOS SANTOS SAN BORJA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN BORJA","direccion":"JR FRANZ SCHUBERT S\/N ESQUINA CON JR BOZOVICH","telefono":"4752908","horario":"08 HORAS A 14 HORAS","resp":"ROSARIO TRISTAN GAMARRA","latitud":"-12.101996","longitud":"-76.993833"},{"codigo":"00006197","nombre":"SAN ISIDRO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN ISIDRO","direccion":"AV. PEREZ ARANIBAR (DEL EJ\u00c9RCITO) 1756","telefono":"2643125 \/ 2643740","horario":"8-20 HORAS","resp":"MIHAELA BARJOVEANU CAILEANU","latitud":"-12.106887","longitud":"-77.055072"},{"codigo":"00006999","nombre":"SAGRADA FAMILIA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ. I LT. 8 AV. EL PARQUE COOP. SAGRADA FAMILIA","telefono":"3886661","horario":"08:00 - 02:00","resp":"GIOVANNA MARY JARA BALTAZAR","latitud":"-11.976644","longitud":"-76.988583"},{"codigo":"00007046","nombre":"CESAR VALLEJO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ. P LOTE N\u00ba3 - AAHH CESAR VALLEJO","telefono":"7248872","horario":"LUNES A S\u00c1BADO 8:00AM A 2:00PM","resp":"WALTER ENRIQUE ZAPATA ACHA","latitud":"-11.94722","longitud":"-77.00766"},{"codigo":"00005614","nombre":"BAYOVAR","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. 1ERO DE MAYO 3RA ETAPA - AAHH BAYOVAR","telefono":"3922245","horario":"08:00 - 20:00","resp":"GUISELLA ROMY BAUTISTA BENITO","latitud":"-11.952263","longitud":"-76.991838"},{"codigo":"00005615","nombre":"SU SANTIDAD JUAN PABLO II","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"ESQUINA JIRON EL PASO Y JIRON EL PARALELO S\/N - AA","telefono":"3920692","horario":"08:00 - 20:00","resp":"JUAN ALBERTO QUISPE LAZO","latitud":"-11.94469","longitud":"-76.990678"},{"codigo":"00005616","nombre":"10 DE OCTUBRE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ. F 5 S\/N AAHH 10 DE OCTUBRE","telefono":"3920683","horario":"LUNES A S\u00c1BADO 8:00AM A 8:00PM","resp":"MARLENY RUTH LIMAYLLA CHAMORRO","latitud":"-11.945098","longitud":"-76.987692"},{"codigo":"00005620","nombre":"MEDALLA MILAGROSA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. EL PARQUE S\/N -URB. SAN RAFAEL","telefono":"3882503","horario":"08:00 - 20:00","resp":"PATRICIA SALOME EGUSQUIZA ZUZUNAGA","latitud":"-11.977188","longitud":"-77.00614"},{"codigo":"00005622","nombre":"HUASCAR XV","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV.RIO GRANDE S\/N ALTURA PARADERO 9 AV.J.C.MARIATE","telefono":"3922530","horario":"08:00 - 20:00","resp":"YGOR DARWIN RAMOS CORDOVA","latitud":"-11.9557901","longitud":"-77.0022431"},{"codigo":"00005623","nombre":"PROYECTOS ESPECIALES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"CRUCE DE AV. JOS\u00c9 CARLOS MARI\u00c1TEGUI S\/N CON AV. BA","telefono":"3875550","horario":"LUNES A S\u00c1BADO 8:00AM A 8:00PM","resp":"JUANA DEL CARMEN SUAREZ PONGO","latitud":"-11.9559777","longitud":"-76.9923698"},{"codigo":"00005624","nombre":"JAIME ZUBIETA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR.COCHARCAS MZ. A LT. 1 AAHH JAIME ZUBIETA","telefono":"3877589","horario":"08:00 - 20:00","resp":"JANET RODRIGUEZ RODRIGUEZ","latitud":"-11.9634166","longitud":"-76.9888754"},{"codigo":"00005625","nombre":"SANTA MARIA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV.HEROES DEL CENEPA MZ D2 - AAHH SANTA MARIA","telefono":"3883774","horario":"08:00 - 20:00","resp":"AQUILINA LIMACO GUILLEN","latitud":"-11.965265","longitud":"-76.9762221"},{"codigo":"00005626","nombre":"TUPAC AMARU II","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ.A - LOTE S\/N AAHH JAVIER PEREZ DE CUELLAR","telefono":"3925650","horario":"08:00 - 02:00","resp":"JOSE WILDER SUAREZ VASQUEZ","latitud":"-11.955762","longitud":"-76.977468"},{"codigo":"00005627","nombre":"CRUZ DE MOTUPE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV.CENTRAL S\/N-GRUPO 5 - AAHH CRUZ DE MOTUPE (ALT ","telefono":"3920678","horario":"08:00 - 20:00","resp":"AMILCAR CHAHUARA MIRANDA","latitud":"-11.94122","longitud":"-76.974923"},{"codigo":"00005628","nombre":"JOSE CARLOS MARIATEGUI","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. EL CRUCE MZ. H S\/N AAHH JOSE CARLOS MARIATEGUI","telefono":"3924900","horario":"LUNES A S\u00c1BADO 8:00AM A 8:00PM","resp":"ROCIO LOURDES SALVADOR DE LA CRUZ","latitud":"-11.945057","longitud":"-76.984556"},{"codigo":"00005845","nombre":"DANIEL ALCIDES CARRION","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. ALFONSO UGARTE, CUADRA 3 S\/N COOPERATIVA DANIE","telefono":"3861646","horario":"08:00 - 02:00","resp":"LAURA VERONICA PICON CASTILLO","latitud":"-12.023391","longitud":"-76.977054"},{"codigo":"00005846","nombre":"CAJA DE AGUA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"URB CAJA DE AGUA JR. MOQUEGUA 202","telefono":"4583445","horario":"08:00 - 20:00","resp":"CARLOS NAPOLEON POZO NU\u00d1EZ","latitud":"-12.026898","longitud":"-77.014955"},{"codigo":"00005848","nombre":"CAMPOY","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. PRINCIPAL MZ. G LTE. 2-COOP.EL VALLE","telefono":"3861645","horario":"08:00 - 20:00","resp":"FABIOLA DE LOS MILAGROS BOYER YACILA","latitud":"-12.021264","longitud":"-76.959593"},{"codigo":"00005849","nombre":"ZARATE","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR.LOS CHASQUIS CON YUPANQUIS","telefono":"4598400","horario":"08:00 - 20:00","resp":"ANGELA MAYELA ZAPATA CARHUANCHO","latitud":"-12.023286","longitud":"-76.994517"},{"codigo":"00005834","nombre":"LA LIBERTAD","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. MARGARITAS 1545 - URB. INCA MANCO CAPAC","telefono":"4584186","horario":"08:00 - 20:00","resp":"DANTE YOSHIO HIGA ORTIZ","latitud":"-12.004207","longitud":"-76.995896"},{"codigo":"00005835","nombre":"LA HUAYRONA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"CALLE LAS GEMAS S\/ - EL PARQUE -COOP.LA HUAYRONA","telefono":"3877400","horario":"08:00 - 20:00","resp":"MARIA DEL CARMEN VILLAFUERTE SOTELO","latitud":"-11.993977","longitud":"-77.006696"},{"codigo":"00005836","nombre":"SANTA FE DE TOTORITA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. CANTUTA S\/N AAHH. SANTA FE DE TOTORITA","telefono":"3766489","horario":"LUNES A S\u00c1BADO 8:00AM A 2:00PM","resp":"EDMUNDO ALEJANDRO VARGAS LAREDO","latitud":"-11.9970551","longitud":"-76.9960018"},{"codigo":"00005837","nombre":"SAN HILARION","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. LOS SILICIOS S\/N URB. SAN HILARION","telefono":"3882500","horario":"LUNES A S\u00c1BADO 8:00AM A 8:00PM","resp":"LEONARDO SOLIER AYALA","latitud":"-11.9958755","longitud":"-77.0159599"},{"codigo":"00005838","nombre":"SAN FERNANDO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR.LAS ORTIGAS 1893 URB.SAN HILARION-ALTURA PDO.13","telefono":"4584806","horario":"08:00 - 20:00","resp":"SONIA MARIA VALDIVIESO ULLOA","latitud":"-12.002721","longitud":"-77.010633"},{"codigo":"00005839","nombre":"15 DE ENERO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. 15 DE ENERO MZ. E PDO.9 AV. CANTO GRANDE","telefono":"4595839","horario":"08:00 - 02:00","resp":"YUNET CIRILA MAMANI AYALA","latitud":"-12.0111777","longitud":"-77.0186169"},{"codigo":"00005840","nombre":"SANTA ROSA DE LIMA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. LIMA MZ. C LTE. 21-22 - CANTO CHICO","telefono":"3760431","horario":"08:00 - 20:00","resp":"WAYMER ARNULFO BENITES CERNA","latitud":"-12.0053943","longitud":"-77.016424"},{"codigo":"00005841","nombre":"CHACARILLA DE OTERO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"JR. JOSE ANTONIO ENCINAS N\u00ba 155 - URB.CHACARILLA D","telefono":"4583290 - 4583230","horario":"07:30 - 19:30","resp":"MYRIAM ELEANA MORI JAUREGUI","latitud":"-12.021095","longitud":"-77.006985"},{"codigo":"00005847","nombre":"MANGOMARCA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. EL SANTUARIO S\/N(CDRA. 24 S\/N) URB. MANGOMARCA","telefono":"3790380","horario":"08:00 - 20:00","resp":"GRACIANO EDWIN HUAMAN SOTOMAYOR","latitud":"-12.010636","longitud":"-76.979521"},{"codigo":"00005844","nombre":"AZCARRUNZ ALTO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV.LURIGANCHO CDRA.9 S\/N MZ.B LOTE 49 - URB.AZCARR","telefono":"4596890","horario":"LUNES A S\u00c1BADO 8:00AM A 2:00PM","resp":"EVELYN YNGRID GAMARRA FLORES","latitud":"-12.017461","longitud":"-77.000146"},{"codigo":"00005618","nombre":"GANIMEDES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. EL SOL MZ J S\/N - URB. GANIMEDES","telefono":"3872790","horario":"08:00 - 20:00","resp":"IRMA VIOLETA HIDALGO VEGA","latitud":"-11.983377","longitud":"-77.011446"},{"codigo":"00005621","nombre":"HUASCAR II","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"GRUPO II MZ 23 LTES. 101-107-108 - AAHH HUASCAR","telefono":"3882482","horario":"08:00 - 20:00","resp":"LUIS EDUARDO URBINA NU\u00d1EZ","latitud":"-11.967014","longitud":"-77.01082"},{"codigo":"00005619","nombre":"AYACUCHO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV. JUANA I MZ. G1 S\/N ASOC. AYACUCHO","telefono":"3877580","horario":"LUNES A S\u00c1BADO 8:00AM A 2:00PM","resp":"PILAR YOVANA COSME MOLINA","latitud":"-11.987098","longitud":"-77.016945"},{"codigo":"00005629","nombre":"ENRIQUE MONTENEGRO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"AV.WIESSE S\/N ENRIQUE MONTENEGRO (COSTADO COLEGIO ","telefono":"3924729","horario":"08:00 - 20:00","resp":"ROCIO DEL PILAR VASQUEZ CARHUAMACA","latitud":"-11.937263","longitud":"-76.97113"},{"codigo":"00005630","nombre":"JOSE CARLOS MARIATEGUI V ETAPA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ. X1 LOTE 1 PROGRAMA MARISCAL C\u00c1CERES SECTOR II","telefono":"3926601","horario":"LUNES A S\u00c1BADO 8:00AM A 2:00PM","resp":"FRANK GEYSSON BALABARCA INGARUCA","latitud":"-11.93539","longitud":"-76.992835"},{"codigo":"00007357","nombre":"MARISCAL CACERES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE LURIGANCHO","direccion":"MZ. N8 LT. 4 URB. MARISCAL CACERES (ALT. PDO. 5 AV","telefono":"3927352","horario":"08:00 - 02:00","resp":"ROCIO ASTOLA CASTILLO","latitud":"-11.949762","longitud":"-76.981255"},{"codigo":"00006872","nombre":"JOSE MARIA ARGUEDAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"PASAJE A, MZ F, LOTE 01, SECTOR JOSE MARIA ARGUEDA","telefono":"01-4506060","horario":"8:00-17:00","resp":"MARIO ALONSO ARAMBURU RENGIFO","latitud":"-12.132856","longitud":"-76.95527"},{"codigo":"00007645","nombre":"5 DE MAYO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"JR. LIBERTAD MZ.A6-LOTE 28-SECTOR 5 DE MAYO-PAMPLO","telefono":"01-2853628","horario":"8:00-14:00","resp":"SOFIA TERESA GOMEZ GALLEGOS","latitud":"-12.132402","longitud":"-76.96257"},{"codigo":"00007434","nombre":"LADERAS DE VILLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"MANUEL IGLESIAS LOTE A.V. - 2 REF. CALLE RETAMA - ","telefono":"01-7718077","horario":"8:00-14:00","resp":"CARLOS EDUARDO DUE\u00d1AS CHAMORRO","latitud":"-12.189522","longitud":"-76.957777"},{"codigo":"00013486","nombre":"PS MARIANNE PREUSS DE STARK","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"MZ 78 LT5 (LOS LAURELES) INTERSECCION CALLE Q1 Y C","telefono":"01-2851020","horario":"8:00 - 14:00","resp":"PAUL ALEJANDRO VIZCARRA MEDINA","latitud":"-12.14753","longitud":"-76.962257"},{"codigo":"00006163","nombre":"LEONCIO PRADO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"MZ I-10 LOTE 6- SECTOR LEONCIO PRADO","telefono":"01-2854253","horario":"8:00-14:00","resp":"OSCAR CAMPOS RIVERO","latitud":"-12.136654","longitud":"-76.961406"},{"codigo":"00006105","nombre":"LEONOR SAAVEDRA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. TORRES PAZ CDRA. 1 ESQ. CDRA. 4 AV. LOS H\u00c9ROES","telefono":"01-4503113","horario":"7:00-19:00","resp":"MANUELA ROSALBINA LAZARO CALDERON","latitud":"-12.153404","longitud":"-76.972404"},{"codigo":"00006106","nombre":"VILLA SAN LUIS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. SOLIDARIDAD Y JOS\u00c9 C. MARI\u00c1TEGUI MZ.H-7 LTE.9 ","telefono":"01-2851545","horario":"7:00-19:00","resp":"YUREMA FRISANCHO LOAYZA","latitud":"-12.138958","longitud":"-76.974041"},{"codigo":"00006108","nombre":"VIRGEN DEL BUEN PASO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. CENTENARIO PARAD.14, SECT.V\u00cdRGEN DEL BUEN PASO","telefono":"01-2855967","horario":"8:00-14:00","resp":"ELIA GIANINA TELLO MEJIA","latitud":"-12.139437","longitud":"-76.960214"},{"codigo":"00006109","nombre":"JESUS PODEROSO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"PUEBLO JOVEN JESUS PODEROSO LOTE C MZ T S\/N PAMPLO","telefono":"01-4502516","horario":"08:00-14:00","resp":"KAREN LIZET WURTTELE CICCIA","latitud":"-12.1305597","longitud":"-76.951192"},{"codigo":"00006110","nombre":"SAN FRANCISCO DE LA CRUZ","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"PROLONGACION CANEVARO S\/N SAN FRANCISCO DE LA CRUZ","telefono":"01-2854219","horario":"8:00-14:00","resp":"EDWING DAVIS RIOS HERNANDEZ","latitud":"-12.151483","longitud":"-76.963095"},{"codigo":"00006111","nombre":"12 DE NOVIEMBRE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. LAS AM\u00c9RICAS, SECTOR 12 DE NOVIEMBRE","telefono":"01-2853560","horario":"08:00-14:00","resp":"HAROLD OBREGON ROMERO","latitud":"-12.137185","longitud":"-76.968088"},{"codigo":"00006112","nombre":"LA RINCONADA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"MZ T2 LOTE 15 AAHH LA RINCONADA -PAMPLONA ALTA","telefono":"01-2854570","horario":"8:00-14:00","resp":"JORGE LUIS ORTIZ ORME\u00d1O","latitud":"-12.126055","longitud":"-76.959061"},{"codigo":"00006113","nombre":"EL BRILLANTE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"PROLONGACION AV. SAN JUAN CON AVDA DEFENSORES DE L","telefono":"01-2856159","horario":"8:00-14:00","resp":"ROSA NANCY ALAMO ZAPATA","latitud":"-12.148115","longitud":"-76.969023"},{"codigo":"00006114","nombre":"6 DE JULIO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"ASOCIACION MAGISTERIAL MZ I LOTE S\/N-PAMPLONA BAJA","telefono":"01-2754668","horario":"8:00-14:00","resp":"FIORELA ELENA LA TORRE SANCHEZ","latitud":"-12.140567","longitud":"-76.978016"},{"codigo":"00006115","nombre":"SAN JUAN DE MIRAFLORES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"PSJE. SAN JUAN S\/N ZONA A (JUNTO COMISAR\u00cdA SJM)","telefono":"01-4660816","horario":"8:00-20:00","resp":"CESAR VICTOR ZELA ACU\u00d1A","latitud":"-12.15806","longitud":"-76.97524"},{"codigo":"00006116","nombre":"VALLE SHARON","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"ESQ. DE LOS ALEL\u00cdS Y CIPRECES S\/N. VALLE SHARON","telefono":"01-4508368","horario":"8:00-14:00","resp":"MONICA JANET GASTON VIDAL","latitud":"-12.170993","longitud":"-76.966215"},{"codigo":"00006117","nombre":"PAMPAS DE SAN JUAN","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. PEDRO SILVA CDRA. 10 S\/N ZONA C","telefono":"01-4508370","horario":"8:00-14:00","resp":"ROSA ELVIRA GRENTZ COSSER","latitud":"-12.166744","longitud":"-76.967681"},{"codigo":"00006118","nombre":"VILLA SOLIDARIDAD","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"CALLE 9 MZ F-A LOTE 3 ASENTAMIENTO HUMANO VILLA SO","telefono":"01-4508371","horario":"8:00-14:00","resp":"SILVIA ROSANNA LIRA VASQUEZ DE AQUINO","latitud":"-12.170498","longitud":"-76.96058"},{"codigo":"00006119","nombre":"RICARDO PALMA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"MZ. F LOTE 1 ASOCIACION DE VIVIENDA TRADICIONES RI","telefono":"01-2800377","horario":"8:00-14:00","resp":"ELENA ELIZABETH MU\u00d1OZ VERA","latitud":"-12.184126","longitud":"-76.961074"},{"codigo":"00006120","nombre":"PARAISO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"CALLE L, LTE. 6 Y 7 MZ. H, AAHH- PARAISO","telefono":"01-2921319","horario":"8:00-14:00","resp":"CESAR AUGUSTO BARDALES ZAVALLOS","latitud":"-12.184461","longitud":"-76.95605"},{"codigo":"00006121","nombre":"SANTA URSULA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"CALLE SANTA TERESA MZ G LOTE 17 S\/N COOPERATIVA SA","telefono":"01-2927192","horario":"8:00-14:00","resp":"IVAN DANTE BACIGALUPO LARREA","latitud":"-12.180969","longitud":"-76.964065"},{"codigo":"00006122","nombre":"TREBOL AZUL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"AV. MIGUEL GRAU MZ. L, LOTE. 15 - ALT. CDRA 9 AV. ","telefono":"01-2762502","horario":"8:00-20:00","resp":"CARLOS GUTIERREZ ENRIQUEZ","latitud":"-12.17775","longitud":"-76.965864"},{"codigo":"00006123","nombre":"HEROES DEL PACIFICO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN JUAN DE MIRAFLORES","direccion":"JR. 1\u00b0 DE ENERO S\/N AAHH PACIFICO I SJM","telefono":"01-4500962","horario":"8:00-14:00","resp":"JESUS ANGEL GUTIERREZ ZARATE","latitud":"-12.172949","longitud":"-76.95689"},{"codigo":"00006177","nombre":"SAN LUIS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN LUIS","direccion":"CALLE RA\u00daL VILLAR\u00c1N 332","telefono":"4743865","horario":"L-V: 8-19 HORAS; S: 8-14 HORAS","resp":"JOSE PRADO GUZMAN","latitud":"-12.075842","longitud":"-76.997165"},{"codigo":"00005811","nombre":"INFANTAS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"CALLE SANTA MARINA 107 - URB JOSE DE SAN MARTIN","telefono":"5369197","horario":"LUN-SAB: 8 A 20 HORAS","resp":"CARLOS HUMBERTO GONZALES ORBEGOSO","latitud":"-11.947943","longitud":"-77.068094"},{"codigo":"00005812","nombre":"CENTRO DE SALUD SAN JUAN DE SALINAS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR. TURQUESAS S\/N\u00b0, PARQUE 8, ASOCIACION DE VIVIEN","telefono":"5754499","horario":"07:00 - 20:00","resp":"DAVID MARTIN ESPINOZA MONGE","latitud":"-11.9845042","longitud":"-77.0979533"},{"codigo":"00005808","nombre":"CERRO CANDELA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV FELIPE DE LAS CASAS MZ B1 LT 9 - AAHH CERRO CAN","telefono":"6282538","horario":"LUN-SAB: 08 A 14 HORAS","resp":"JOSE CARLOS URBANO VENTOCILLA","latitud":"-11.972234","longitud":"-77.106448"},{"codigo":"00005809","nombre":"EX FUNDO NARANJAL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR JIRCAN 604 MZ I LT 24 COOP DE VIV EX HACIENDA N","telefono":"5286286","horario":"12 HORAS","resp":"MICHEL PINEDO CORDERO","latitud":"-11.967081","longitud":"-77.08731"},{"codigo":"00005742","nombre":"MEXICO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV DIEZ CANSECO N\u00ba 3613 - URB CONDEVILLA","telefono":"5683022","horario":"12 HORAS","resp":"MAXIMO FERMIN CORNEJO ESCATE","latitud":"-12.024998","longitud":"-77.085436"},{"codigo":"00005743","nombre":"PERU IV ZONA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV PERU N\u00ba 3595 - URB. PERU","telefono":"5677889","horario":"12 HORAS","resp":"ROMAN INOCENCIO IBARGUEN URIBE","latitud":"-12.031228","longitud":"-77.086266"},{"codigo":"00005744","nombre":"CONDEVILLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR JOSE MARIA CORDOVA 3397 - URB CONDEVILLA","telefono":"5686161","horario":"08:00 - 20:00 HORAS","resp":"JOSE ARGENTINO NESTARES ROJAS","latitud":"-12.021451","longitud":"-77.081375"},{"codigo":"00005745","nombre":"AMAKELLA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR. FERM\u00cdN NACARIO N\u00ba 112, COOP. AMAKELLA 2DA. ETA","telefono":"5680518","horario":"LUN-SAB: 7 A 19 HORAS","resp":"ANA LUISA ZAMBRANO ROMERO","latitud":"-12.017786","longitud":"-77.078549"},{"codigo":"00005746","nombre":"LOS LIBERTADORES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV LIBERTADOR DON JOSE DE SAN MARTIN N\u00ba 1055 - ASO","telefono":"5312796","horario":"12 HORAS","resp":"MARIA ESTHER PUELL BARRIENTOS","latitud":"-12.00661","longitud":"-77.089495"},{"codigo":"00005747","nombre":"VALDIVIEZO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"CALLE LAS DALIAS N\u00ba 171 - URB. VALDIVIEZO","telefono":"5678782","horario":"12 HORAS","resp":"FLORINDA REYES CERNA DE BARRERA","latitud":"-12.023954","longitud":"-77.066553"},{"codigo":"00005748","nombre":"SAN MARTIN DE PORRES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"PASAJE LEONES N\u00ba 115 - ASOC. PEDREGAL","telefono":"4825580","horario":"LUN-VIER 8 A 20 HORAS \/ S: 8 A 14 HORAS","resp":"LUIS ALBERTO CHAVEZ VIVANCO","latitud":"-12.034813","longitud":"-77.05502"},{"codigo":"00005749","nombre":"PERU III ZONA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV UNIVERSITARIA 181 URB CONDEVILLA","telefono":"6880396","horario":"06 HORAS","resp":"JULISA CABALLERO AMADO","latitud":"-12.028517","longitud":"-77.076559"},{"codigo":"00005750","nombre":"CERRO LA REGLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"MZ B LT 11 - AAHH ESPERANZA, COMIT\u00c9 2","telefono":"577-2278","horario":"06 HORAS","resp":"CARLOS EDUARDO PRETEL VERGEL","latitud":"-11.9896127","longitud":"-77.1157647"},{"codigo":"00005751","nombre":"GUSTAVO LANATTA LUJAN","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR FELIX DE VALLE 505 - URB CONDEVILLA 2DA ETAPA","telefono":"567-4776","horario":"12 HORAS","resp":"ELVIA PILAR SERRANO MEDINA","latitud":"-12.016521","longitud":"-77.083004"},{"codigo":"00005804","nombre":"VIRGEN DEL PILAR DE NARANJAL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"AV. LOS ALISOS N\u00ba 397 - URB. NARANJAL","telefono":"4851705","horario":"LUN-SAB: 8-14 HORAS Y DE 14 A 19 HORAS","resp":"JANET CLARIZA CHAPO\u00d1AN CABRERA","latitud":"-11.983987","longitud":"-77.062837"},{"codigo":"00005805","nombre":"MESA REDONDA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MARTIN DE PORRES","direccion":"JR SANCHEZ CERRO 295 - URB MESA REDONDA","telefono":"533-4298","horario":"06 HORAS","resp":"MANUEL ALBERTO CHAVEZ QUISPE","latitud":"-12.004437","longitud":"-77.05737"},{"codigo":"00006198","nombre":"SAN MIGUEL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MIGUEL","direccion":"AV LIBERTAD AV LOS MOCHICAS S\/N","telefono":"5782718","horario":"07:30 - 19 HORAS","resp":"FEDERICO LIZARRAGA FERRAND","latitud":"-12.081522","longitud":"-77.098529"},{"codigo":"00006199","nombre":"HUACA PANDO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SAN MIGUEL","direccion":"LOS SAUCES MZ B-II NOVENA ETAPA","telefono":"4520272","horario":"L-S 8-14 HORAS","resp":"NELLY MARIA CACHIQUE CLAUSEN","latitud":"-12.061614","longitud":"-77.083277"},{"codigo":"00005852","nombre":"COOPERATIVA UNIVERSAL","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"AV. J.C. MARIATEGUI CDRA. 5 - 2DA ETAPA - ESPALDA ","telefono":"3620318","horario":"08:00 - 20:00","resp":"JAIME WALTER PILLACA GONZALES","latitud":"-12.043586","longitud":"-76.975567"},{"codigo":"00005853","nombre":"CHANCAS DE ANDAHUAYLAS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"CL VIRU S\/N PARQUE 4-COOP. CHANCAS DE ANDAHUAYLAS ","telefono":"3625980","horario":"08:00 - 20:00","resp":"JULIO ALBERTO MARTINEZ APAZA","latitud":"-12.0553366","longitud":"-76.9690575"},{"codigo":"00005854","nombre":"HUASCAR","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"AV. MAR\u00cdA PARADO DE BELLIDO S\/N ( ALT. CDRA. 20 DE","telefono":"3620170","horario":"08:00 - 20:00","resp":"JACLYN ELIZABETH FERNANDEZ MIDEYROS","latitud":"-12.040476","longitud":"-76.984396"},{"codigo":"00005855","nombre":"METROPOLITANA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"AV. LOS RUISE\u00d1ORES 873-A URB.SANTA ANITA","telefono":"3625135","horario":"08:00 - 20:00","resp":"GILMAR LEYVA RAMIREZ","latitud":"-12.044919","longitud":"-76.969682"},{"codigo":"00005856","nombre":"SAN CARLOS","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"AV.METROPOLITANA MZ B LT.7B ASOC. PRO-VIV SAN CARL","telefono":"3548307","horario":"08:00 - 20:00","resp":"JUAN SAMUEL ARNAO LOO","latitud":"-12.039431","longitud":"-76.958384"},{"codigo":"00005857","nombre":"VI\u00d1A SAN FRANCISCO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"URBANIZACION PRODUCTORES MZ A LT 14","telefono":"3548422","horario":"08:00 - 20:00","resp":"GONZALO GABINO NU\u00d1EZ","latitud":"-12.033188","longitud":"-76.951488"},{"codigo":"00005924","nombre":"NOCHETO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"CALLE JAVIER HERAUD S\/N URB. AH NOCHETO","telefono":"3620584","horario":"08:00 - 20:00","resp":"ORLANDO ALVAREZ MUNGI","latitud":"-12.046531","longitud":"-76.984475"},{"codigo":"00005925","nombre":"SANTA ROSA DE QUIVES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ANITA","direccion":"CALLE LOS CACTUS MZ.W1 LT. 43 COOP. STA. ROSA DE Q","telefono":"3620504","horario":"08:00 - 02:00","resp":"CARLOS ALAN YACSAVILCA","latitud":"-12.052755","longitud":"-76.982705"},{"codigo":"00005825","nombre":"VIRGEN DE LAS MERCEDES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTA ROSA","direccion":"ASOC. VIV. SANTA ROSA MZ. B LT. 09","telefono":"552-1671","horario":"8:00 - 20:00","resp":"FREDDY PAREDES ALPACA","latitud":"-11.81525","longitud":"-77.1316766"},{"codigo":"00005993","nombre":"CENTRO DE SALUD SANTIAGO DE SURCO","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"JR. DANIEL CORNEJO 182","telefono":"01-2477793\/01-2479043","horario":"8:00 - 7:00","resp":"ROSA MARIA JIMENEZ CACERES","latitud":"-12.147638","longitud":"-77.006432"},{"codigo":"00006952","nombre":"LAS DUNAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"CALLE LOS HERRERILLOS MZA F LTE 1 S\/N - LAS DUNAS","telefono":"01-4509058","horario":"8:00 - 14:00","resp":"ZANDRA ESTELA QUISPE RODRIGUEZ","latitud":"-12.16205","longitud":"-76.99059"},{"codigo":"00005997","nombre":"LAS FLORES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"CALLE FERRE\u00d1AFE 220 - 2DA CUADRA EL POLO URB. LAS ","telefono":"01-4366962","horario":"8:00 - 14:00","resp":"HUMALA LEMA ELSA RAQUEL","latitud":"-12.1393355","longitud":"-77.0003018"},{"codigo":"00005996","nombre":"LOS VI\u00d1EDOS DE SURCO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"MZ F LOTE 12 AAHH VI\u00d1EDOS DE SURCO","telefono":"01-2470467","horario":"8:00 - 19:00","resp":"ROXANA ELISA GARATE GARATE DE VELASQUEZ","latitud":"-12.162701","longitud":"-76.989525"},{"codigo":"00005994","nombre":"SAN CARLOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"JR. MARISCAL SANTA CRUZ S\/N AAHH SAN CARLOS","telefono":"01-2472593","horario":"8:00 - 14:00","resp":"PEDRO GERBER SOTO CHOQUEHUANCA","latitud":"-12.153044","longitud":"-77.016415"},{"codigo":"00005995","nombre":"PUESTO DE SALUD SAN ROQUE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"SANTIAGO DE SURCO","direccion":"ESTEBAN CAMERE 378 - URB SAN ROQUE","telefono":"01-5575468","horario":"8:00 - 14:00","resp":"ERNESTO VERDE TIBURCIO","latitud":"-12.148129","longitud":"-76.988718"},{"codigo":"00006179","nombre":"RED DE SALUD LIMA CIUDAD","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SURQUILLO","direccion":"AV SAUCE MZ A1 LOTE 1","telefono":"4493449","horario":"L-S: 8-14 HORAS","resp":"GLADYS OLIVIA VEGA CARDENAS","latitud":"-12.121211","longitud":"-76.998916"},{"codigo":"00006180","nombre":"VILLA VICTORIA PORVENIR","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"SURQUILLO","direccion":"AV. MARTIN LUTHER KING S\/N\u00b0, URB. VILLA VICTORIA","telefono":"2254253","horario":"24 HORAS","resp":"ANCA MIHAELA BARJOVEANU CAILEANU","latitud":"-12.108832","longitud":"-77.012105"},{"codigo":"00007278","nombre":"PUESTO DE SALUD HEROES DEL CENEPA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"JR. HEROES DEL CENEPA MZ C LT 20, ALT DE PANAM.SUR","telefono":"7838778","horario":"08:00 - 14:00","resp":"BASTIDAS CAMARENA HUBERT ALEX","latitud":"-12.248749","longitud":"-76.930706"},{"codigo":"00007716","nombre":"SASBI","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"SECTOR 6 - GRUPO 01 -S\/N PARQUE CENTRAL","telefono":"2875605","horario":"06 HRS \/ 08:00 A 14:00","resp":"RAUL ROBINSON CHAVEZ VELASQUEZ","latitud":"-12.208811","longitud":"-76.95573"},{"codigo":"00006125","nombre":"SAN MARTIN DE PORRES","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"CALLE LOS BOMBEROS S\/N ST. 2 GR. 15","telefono":"4930655","horario":"07:00 - 19:00","resp":"WILSON AYLAS LIMACHI","latitud":"-12.212154","longitud":"-76.93944"},{"codigo":"00006126","nombre":"PRINCIPE DE ASTURIAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"AA.HH. PRINCIPE DE ASTURIAS S\/N LT 17-IV ETAPA DE ","telefono":"2933917","horario":"08:00 - 14:00","resp":"SANDOVAL BELLING LOURDES MARIA","latitud":"-12.230355","longitud":"-76.911361"},{"codigo":"00006127","nombre":"PUESTO DE SALUD PACHACAMAC","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"AV. 200 MILLAS BARRIO 2,SECTOR 1, IV ETAPA-PACHACA","telefono":"28580509","horario":"LUNES A SABADO:08:00 - 14:00","resp":"EDWAR HUISA VILLEGAS","latitud":"-12.2243474","longitud":"-76.9220338"},{"codigo":"00006128","nombre":"PUESTO DE SALUD EDILBERTO RAMOS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"AV. TAHUANTINSUYO MZ U S\/N SECTOR 10 AA.HH. EDILBE","telefono":"4932968","horario":"8:00-14:00","resp":"CAROLINA CHANCO RAMIREZ","latitud":"-12.209316","longitud":"-76.9351638"},{"codigo":"00006129","nombre":"BRISAS DE PACHACAMAC","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"AV. REICHE S\/N MZ K AA.HH. BRISAS DE PACHACAMAC","telefono":"2933879","horario":"08:00 - 14:00","resp":"OSCAR JESUS MONTOYA LOPEZ","latitud":"-12.2013856","longitud":"-76.9480428"},{"codigo":"00006131","nombre":"SAGRADA FAMILIA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"ST. 2 GR. 18","telefono":"2881218","horario":"08:00 - 14:00","resp":"MARIA ISABEL CAMARENA HUACHHUACO","latitud":"-12.209131","longitud":"-76.94379"},{"codigo":"00006134","nombre":"PUESTO DE SALUD \"SE\u00d1OR DE LOS MILAGROS\"","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"ST. 1 GR. 25 MZ D1 LOTE 2","telefono":"01-2926439","horario":"06 HORAS \/ 08:00 A 14:00","resp":"YOSHINA SERDAN RENGEL","latitud":"-12.203229","longitud":"-76.952789"},{"codigo":"00006135","nombre":"PUESTO DE SALUD LLANAVILLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"CALLE LA PAZ MZ F LTE 05 SECTOR 8","telefono":"01-2914507","horario":"06 HORAS \/ 08:00 A 14:00","resp":"KARLA ROJAS AGUADO","latitud":"-12.193352","longitud":"-76.941039"},{"codigo":"00006136","nombre":"PUESTO DE SALUD FERNANDO LUYO SIERRA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"SECTOR 7 GRUPO 1 S\/N","telefono":"2590511","horario":"06 HRS \/ 08:00 A 14:00","resp":"GISSELA ROCIO PANIAGUA ALVARADO","latitud":"-12.228789","longitud":"-76.942667"},{"codigo":"00006137","nombre":"CRISTO SALVADOR","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"ST. 9 GR. 2 PARQUE CENTRAL","telefono":"2881230","horario":"06 HRS \/ 08:00 A 14:00","resp":"MIRYAM NATALI LOBE SOLIS","latitud":"-12.2290395","longitud":"-76.9192101"},{"codigo":"00006138","nombre":"SARITA COLONIA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"ST. 2 GR. 24PARQUE CENTRAL","telefono":"2881224","horario":"08:00 A 14:00 LUNES A SABADO","resp":"LUCILA BRITO ASTOCONDOR","latitud":"-12.213234","longitud":"-76.944589"},{"codigo":"00006139","nombre":"OASIS DE VILLA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA EL SALVADOR","direccion":"ST 10 GR 2 MZ P LT 15 AA.HH. OASIS DE VILLA","telefono":"01-2881223","horario":"08:00 A 14:00","resp":"EDUARDO CALLACNA SILVA","latitud":"-12.2107913","longitud":"-76.9346408"},{"codigo":"00006140","nombre":"NUEVA ESPERANZA","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. 26 DE NOVIEMBRE 835 NVA. ESPERANZA","telefono":"01-2913152 \/ 01-2913841","horario":"8:00-20:00","resp":"MAXIMINA DIONISIA JESUS AQUINO","latitud":"-12.172797","longitud":"-76.933583"},{"codigo":"00006142","nombre":"VIRGEN DE LOURDES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. CONDEBAMBA S\/N","telefono":"01-2910741","horario":"8:00-14:00 (L-S) 14:00-18:00 (L--M-V)","resp":"CESAR ANTONIO CAMACHO SILVA","latitud":"-12.1675698","longitud":"-76.9188199"},{"codigo":"00006143","nombre":"PUESTO DE SALUD NUEVA ESPERANZA ALTA","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. R. MERINO Y TACNA MZ 9 LT 1B COMITE 8B NUEVA E","telefono":"01-2914855","horario":"8:00-14:00 HORAS","resp":"ROLANDO EUSEBIO ORDAYA","latitud":"-12.17968","longitud":"-76.936677"},{"codigo":"00006144","nombre":"CESAR VALLEJO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"CRUCE TRILCE Y COMERCIO PAR 7","telefono":"01-2914906","horario":"8:00-14:00","resp":"RICARDO GUILLER MESCCO HUACAC","latitud":"-12.187456","longitud":"-76.937674"},{"codigo":"00006145","nombre":"NUEVO PROGRESO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"PUEBLO JOVEN NUEVO PROGRESO SECTOR I","telefono":"01-2931995","horario":"8:00:14:00","resp":"LISETH PIZARRO DAVILA","latitud":"-12.220973","longitud":"-76.920118"},{"codigo":"00006146","nombre":"PUESTO DE SALUD MODULO I","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"PROLONGACION LUCANAS S\/N PARADERO 12","telefono":"988860795","horario":"8:00-14:00 HORAS","resp":"GALA LITA FLOREZ ROMAN","latitud":"-12.225733","longitud":"-76.906715"},{"codigo":"00006149","nombre":"DAVID GUERRERO DUARTE","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. LOS INCAS ESQ. JR. TUPAC YUPANQUI 2DO SECTOR","telefono":"01-2951826","horario":"8:00-14:00","resp":"MIRTHA EDITH MASGO LARA","latitud":"-12.184201","longitud":"-76.924784"},{"codigo":"00006150","nombre":"LAS CONCHITAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AAHH SANTA ROSA DE LAS CONCHITAS MZ L LOTE 18","telefono":"01-994161225","horario":"8:00-14:00","resp":"ALFONSO ADALBERTO CORNEJO","latitud":"-12.206143","longitud":"-76.92549"},{"codigo":"00006154","nombre":"PUESTO DE SALUD SANTA ROSA DE BELEN","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. BOLIVAR CUADRA 6 CON JOSE OLAYA S\/N","telefono":"01-4506060","horario":"8:00-14:00 HORAS","resp":"CLIDY EDUVIGES RUIZ CUETO","latitud":"-12.158071","longitud":"-76.950969"},{"codigo":"00006155","nombre":"PUESTO DE SALUD SAN GABRIEL ALTO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"PUEBLO JOVEN JOSE CARLOS MARIATEGUI MZ SPCO LOTE T","telefono":"01-2830482","horario":"8:00-14:00 HORAS","resp":"ALFREDO OLIVERA ORELLANA","latitud":"-12.137074","longitud":"-76.948022"},{"codigo":"00006156","nombre":"PUESTO DE SALUD VALLE BAJO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"CALLE INDEPENDENCIA CUADRA 1 S\/N","telefono":"01-2835943","horario":"8:00-14:00","resp":"DERLI FRANKLIN VIZCARRA JAREZ","latitud":"-12.147974","longitud":"-76.942878"},{"codigo":"00006157","nombre":"PUESTO DE SALUD BUENOS AIRES","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"BUENOS AIRES S\/N SAN GABRIEL BAJO","telefono":"01-7678501","horario":"8:00-14:00 HORAS","resp":"ALBERTO NAPOLEON REMY SANCHEZ","latitud":"-12.148252","longitud":"-76.954951"},{"codigo":"00006158","nombre":"PUESTO DE SALUD VILLA LIMATAMBO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"MZ J1 LOTE 2 AAHH VILLA LIMATAMBO","telefono":"01-4506060","horario":"8:00-14:00 HORAS","resp":"JHON ELMER MORALES PIMENTEL","latitud":"-12.134478","longitud":"-76.941907"},{"codigo":"00006159","nombre":"PUESTO DE SALUD VALLE ALTO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"CALLE ALFONSO UGARTE S\/N ALTURA DE LA CUADRA 11. A","telefono":"01-2602089","horario":"8:00-14:00 HORAS","resp":"CHRISTIAN MANUEL ABREGU FLORES","latitud":"-12.142224","longitud":"-76.939318"},{"codigo":"00006160","nombre":"MICAELA BASTIDAS","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"JR. JOSE OLAYA S\/N","telefono":"01-997632779","horario":"8:00-14:00","resp":"EDDY RAUL MOHINA VIVANCO","latitud":"-12.172575","longitud":"-76.950362"},{"codigo":"00006161","nombre":"TORRES DE MELGAR","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"MZ. SPCO LOTE PM AAHH TORRES DE MELGAR","telefono":"01-2929682","horario":"8:00-14:00","resp":"FELIX RONNY ARIAS MANRIQUE","latitud":"-12.178746","longitud":"-76.951232"},{"codigo":"00009565","nombre":"PARAISO ALTO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"PROYECTO INTEGRAL PARA\u00cdSO ALTO , MZ F2 ,LOTE 1 , S","telefono":"01-2811130","horario":"8:00-14:00","resp":"JHONNY ALBERTO MARTINEZ SALAZAR","latitud":"-12.140445","longitud":"-76.923656"},{"codigo":"00012847","nombre":"CIUDAD DE GOSEN","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"DIVINO MAESTRO MZ D LT 11","telefono":"01-4506071","horario":"LUNES A SABADO 8:00 - 14:00","resp":"HANS LUIS RICALDI QUINTANA","latitud":"-12.213772","longitud":"-76.920566"},{"codigo":"00017440","nombre":"JUAN CARLOS SOBERON","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"PROLONGACION AV. JOSE CARLOS MARIATEGUI MZ 6 LOTE ","telefono":"963534805","horario":"LUNES A SABADO : 8 AM- 2 PM","resp":"JUAN RAUL FUERTES MATEO","latitud":"-12.163089","longitud":"-76.929749"},{"codigo":"00015544","nombre":"CENTRO DEL ADULTO MAYOR TAYTA WASI","tipo":"CENTROS DE SALUD O CENTROS MEDICOS","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"AV. PRIMAVERA CRUZE CON CALLE SUCRE S\/N PPJJ JOSE ","telefono":"01-2599171","horario":"LUNES A SABADO 8:00 - 14:00 HORAS","resp":"LEONARDO MIGUEL CHIONG BARMUTA","latitud":"-12.152244","longitud":"-76.951763"},{"codigo":"00016630","nombre":"12 DE JUNIO","tipo":"PUESTOS DE SALUD O POSTAS DE SALUD","departamento":"LIMA","provincia":"LIMA","distrito":"VILLA MARIA DEL TRIUNFO","direccion":"CALLE AMANCAES S\/N, INTERSECCI\u00d3N CON PASAJE LAS FL","telefono":"969150622","horario":"LUNES A S\u00c1BADO 8.00 AM- 2.00 PM.","resp":"JOSE RAFAEL LA CRUZ ACU\u00d1A","latitud":"-12.1568","longitud":"-76.94996"}];
          $scope.initMap($scope.data);
          $ionicLoading.hide();
         
         // $ionicPopup.alert({ title: 'Error', template: 'Lo lamento, el servidor no responde, por favor intentelo mas tarde.' });
        });


     var options = {timeout: 10000, enableHighAccuracy: true};
 
/*
       $scope.printMarkers = function(map, data){
      var beachMarker;
      beachMarker = new google.maps.Marker({
           position: {lat: parseFloat(data.latitud), lng: parseFloat(data.longitud)},
            map: $scope.map,
            icon: centroimg,
            animation: google.maps.Animation.DROP,
            title: $scope.data.nombre
      });
      markers.push(beachMarker); // add marker to array

      beachMarker.addListener('click', function() {

        $scope.first=false;

         if (infoWindow !== void 0) {
              infoWindow.close();
         }

         infoWindow = new google.maps.InfoWindow({
            content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>"+data.tipo+"</td></tr><tr>"+
            "<td><b>"+data.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='fa fa-map-marker fa-1x'></i></td><td>"+data.direccion+", "+data.distrito+", "+data.provincia+", "+data.departamento+"</td>"+
          "</tr><tr><td><i class='fa fa-phone fa-1.5x'></i></td><td>"+data.telefono+"</td></tr><tr><td><i class='fa fa-clock-o fa-1x'></i></td><td>"+data.horario+"</td>"+
          "</tr><tr><td><i class='fa fa-user fa-1x'></i></td><td>"+data.resp+"</td></tr></tbody></table>",
          maxHeight: 400,
          maxWidth: 300
         });
                

         if (infoWindow) {
//           alert('entró');
             infoWindow.close();
          }
           infoWindow.open($scope.map, beachMarker);
      });

      $scope.dist_rela=Math.sqrt(Math.pow((geoLatitude-$scope.data.latitud),2)+Math.pow((geoLongitude-$scope.data.longitud),2));
   };*/

});


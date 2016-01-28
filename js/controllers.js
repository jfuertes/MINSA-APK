angular.module('starter.controllers', ['uiGmapgoogle-maps', 'ngCordova', 'ui.router'])

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
  .filter('filterNutrientes', function(){
    return function(input){
      if(input==0){
        var retorno = "No Entregado ";
      }
      else if(input==1){
        var retorno = "Entregado ";
      }
      
      return retorno;
    };
  })
    .filter('primeraMayuscula', function(){
    return function(input){

      if(input){
        var primera = input.substr(0,1);
        var porcion = input.substring(1);
        primera = primera.toUpperCase();
        var retorno= primera+porcion;
        return retorno;
      }else{
        return input;
      }
    };
  })
    .filter('filterNoData', function(){
    return function(input){
      if(input == null){
        var retorno = "-";
      }
      else{
        var retorno = input;
      }
      return retorno;
    };
  })
  .filter('filterVacunasMeses', function(){
  return function(id){
    if(id == null){
      var retorno = "dosis unica.";
    }
    else if (id == "0"){
      var retorno = "Aplicable a recien nacidos.";
    }
    else if (id == "1"){
      var retorno = "aplicable con 1 mes de edad.";
    }
    else{
    var retorno = "aplicable con "+id+" meses de edad.";
    }
      return retorno;
    };
  })

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, $location, $state, $rootScope) {

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
  $scope.myGoBack = function(){
    alert("retroceder nunca rendirse jamas");
    $ionicHistory.goBack();
  };


document.addEventListener('deviceready', function() {
        document.addEventListener("backbutton", ShowExitDialog, false);
    }, false);

    function ShowExitDialog() {
      if($state.current.name == "app.principal"){
        navigator.notification.confirm(
                ("¿Desea cerrar la aplicación?"), // message
                exit, // callback
                'Confirmación', // title
                'Si,No' // buttonName
        );
      }
      else if ($state.current.name == "app.profesional-buscar"){
        navigator.notification.confirm(
                ("¿Desea finalizar sesión?"), // message
                alertexit, // callback
                'Confirmación', // title
                'Si,No' // buttonName
        );
      }
      else if ($state.current.name == "app.profesional-vacunar"){
        $state.go('app.profesional-buscar');
      }
          
      else if ($state.current.name == "app.vacunarlo-ya"){
        $state.go('app.profesional-vacunar');
      }
       else if ($state.current.name == "app.adicional"){
        $state.go('app.profesional-vacunar');
      }
      else if ($state.current.name == "app.vacuna"){
        $state.go('app.vacunas');
      }
       else if ($state.current.name == "app.resultados"){
        $state.go('app.buscar');
      }
       else if ($state.current.name == "app.verAdicional"){
        $state.go('app.resultados');
      }
       else if ($state.current.name == "app.buscar" && $rootScope.showDatos == true){
              $rootScope.showDatos = false;
              $state.go('app.buscar');
      }
       else if ($state.current.name == "app.profesional-buscar" && $rootScope.showDatosProf == true){
              $rootScope.showDatosProf = false;
              $state.go('app.profesional-buscar');
      }
  
  
      else if ($state.current.name == "app.correos"){
        $state.go('app.resultados');
      }

      else{
        $state.go('app.principal');
      }
    }
    
     function alertexit(button){
        if(button=="1" || button==1)
        {
            //navigator.app.exitApp();
           //alert($location.path);
        //$ionicHistory.goBack();
      $rootScope.usuario = false;
        $state.go('app.principal');
        }
    }
     function exit(button){
        if(button=="1" || button==1)
        {
            navigator.app.exitApp();
        }
    }


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
.controller('VacunaController', function($scope, $stateParams, $http, $rootScope) {
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
        $rootScope.vacunas = response;
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

  $scope.verAdicional = function() {
      $ionicLoading.hide();
      $location.path('/app/verAdicional').replace();
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
  $rootScope.showDatos = false;
  $scope.neneData = {"tipo":"3", "numero":42579084};
  //$scope.neneData = {"tipo":"1", "numero":1000999595};


  $scope.buscarNeneByCNV = function() {
  $scope.showTable=false;
  $rootScope.showDatos = false;
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
                $rootScope.showDatos=true;    
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
                    $rootScope.showDatos=true;   
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
                if(response.success.length){
                      $ionicLoading.hide();
                      $rootScope.ninos_ws = response.success;
                      $scope.showTable=true;
                }
                else{
                      $ionicLoading.hide();
                      $rootScope.ninos_ws = [{'0':''}];
                      $rootScope.ninos_ws[0] = response.success ;
                      $scope.showTable=true;
                }
              
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
      $rootScope.showDatos = false;
  }
$scope.showtable = function() {
      $ionicLoading.hide();
      $location.path('/app/resultados').replace();
  }
  

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
      
      $ionicHistory.goBack();
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

.controller('ProfesionalBuscarController', function($scope, $stateParams, $location, $http, $ionicLoading, $rootScope, $ionicHistory) {
 $scope.showTable=false;
  console.log('ProfesionalBuscarController > $rootScope.usuario', $rootScope.usuario);
  $scope.neneData = {"tipo":"3", "numero":42579084};
  //$scope.neneData = {"numero":1000999595};
  $scope.buscarNeneByCNV = function() {
    if($scope.neneData.tipo=="1"){
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

    }
    else if($scope.neneData.tipo=="2"){
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
                   $location.path('/app/profesional-vacunar').replace();
                    //$rootScope.showDatos=true;   
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
    else if ($scope.neneData.tipo=="3"){
              console.log('BuscarController > buscarNeneByCNV');
        $scope.loading = $ionicLoading.show({content: 'Buscando...', showBackdrop: true });
          $http(
            {method:'GET',
            url: 'http://esdeporvida.com/projects/minsa/api/wsByDniMadre.php?numero='+$scope.neneData.numero,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
              console.log('BuscarController > buscarNeneByCNV : done');
              delete $rootScope.nino_ws;
              if( response.success){
                if(response.success.length){
                      $ionicLoading.hide();
                      $rootScope.ninos_ws = response.success;
                      $scope.showTable=true;
                }
                else{
                      $ionicLoading.hide();
                      $rootScope.ninos_ws = [{'0':''}];
                      $rootScope.ninos_ws[0] = response.success ;
                      $scope.showTable=true;
                }
              
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
     $scope.selecNino = function(index) {
      $rootScope.nino_ws = $rootScope.ninos_ws[index];
      $ionicLoading.hide();
      $location.path('/app/profesional-vacunar').replace();
  }
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
            alert(response);
            if(response.success){
              alert(response.success);
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


.controller('correosController', function($scope, $stateParams, $location, $rootScope, $http, $ionicLoading,  $ionicPopup, $state) {
 $scope.showCorreos=false;

 $http(
        {method:'GET',
        url: 'http://esdeporvida.com/projects/minsa/api/android/getCorreos.php?numero='+$rootScope.nino_ws.NuCnv,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
          console.log('ProfesionalBuscarController > buscarNeneByCNV : done');
         
         
          if( response.success){
            $ionicLoading.hide();
            $rootScope.CorreosPorNino   = response.success;
            $scope.showCorreos=true;
            //alert(response.success);
          }

         else{
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : else');
            alert("Lo lamento, " + response.error);
            $ionicLoading.hide();
          }
      }).error(function() {
          alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde..');
          $ionicLoading.hide();
      });


    $scope.agregarEmail = function(correo){
        $scope.loading = $ionicLoading.show({content: 'Guardando...', showBackdrop: true });        
          $http({method:'POST',url: 'http://esdeporvida.com/projects/minsa/api/android/agregarCorreo.php', data:$.param({email : correo.new, NuCnv: $rootScope.nino_ws.NuCnv }), headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
            $ionicLoading.hide();
            if(response.success){
              console.log(response.success);
             // $location.path('/app/buscar').replace();
              $ionicPopup.alert({ title: 'Listo!', template: 'El correo electronico fue registrado exitosamente.' });
              $state.go('app.resultados');
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

.controller('verAdicionalController', function($scope, $stateParams, $location, $rootScope, $http, $ionicLoading,  $ionicPopup, $state) {
 $scope.showinfoAdicional=false;

 $http(
        {method:'GET',
        url: 'http://esdeporvida.com/projects/minsa/api/android/getInfoAdicional.php?numero='+$rootScope.nino_ws.NuCnv,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(response) {
          console.log('ProfesionalBuscarController > buscarNeneByCNV : done');
         
         
          if( response.success){
            if(response.success.length==0){
            }
            else{
            $ionicLoading.hide();
            $rootScope.infoAdicional   = response.success;
            $scope.showinfoAdicional=true;
            //alert(response.success);
          }}

         else{
            console.log('ProfesionalBuscarController > buscarNeneByCNV : done : else');
            alert("Lo lamento, " + response.error);
            $ionicLoading.hide();
          }
      }).error(function() {
          alert('Lo lamento, el servidor no esta respondiendo. por favor intentelo mas tarde..');
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
                        "<td><b>"+value.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='icon ion-ios-location'></i></td><td>"+value.direccion+", "+value.distrito+", "+value.provincia+", "+value.departamento+"</td>"+
                      "</tr><tr><td><i class='icon ion-ios-telephone'></i></td><td>"+value.telefono+"</td></tr><tr><td><i class='icon ion-clock'></i></td><td>"+value.horario+"</td>"+
                      "</tr><tr><td><i class='icon ion-person'></i></td><td>"+value.resp+"</td></tr></tbody></table>",
                        maxHeight: 400,
                        maxWidth: 250
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
                    $scope.numArrayMarker= index;
                  }
          });

                $scope.first=false;

            infoWindow = new google.maps.InfoWindow({
              content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>"+$scope.cercano.tipo+"</td></tr><tr>"+
              "<td><b>"+$scope.cercano.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='icon ion-ios-location'></i></td><td>"+$scope.cercano.ubica+", "+$scope.cercano.ubica2+"</td>"+
            "</tr><tr><td><i class='icon ion-ios-telephone'></i></td><td>"+$scope.cercano.telefono+"</td></tr><tr><td><i class='icon ion-clock'></i></td><td>"+$scope.cercano.horario+"</td>"+
            "</tr><tr><td><i class='icon ion-person'></i></td><td>"+$scope.cercano.resp+"</td></tr></tbody></table><p>Centro Mas Cercano</p>",
            maxHeight: 400,
            maxWidth: 250
           });

       /* var beachMarker2 = new google.maps.Marker({
            position: {lat: parseFloat($scope.cercano.latitud), lng: parseFloat($scope.cercano.longitud)},
            map: $scope.map,
            icon: centroimg
          });*/

        infoWindow.open($scope.map, markers[$scope.numArrayMarker]);

        }, function(error){
          console.log("Could not get location");
        });

        }).error(function(){
          $ionicLoading.hide();
         
          $ionicPopup.alert({ title: 'Error', template: 'Lo lamento, el servidor no responde, por favor intentelo mas tarde.' });
        });

     var options = {timeout: 10000, enableHighAccuracy: true};
});


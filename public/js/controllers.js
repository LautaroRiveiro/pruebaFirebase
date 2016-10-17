angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
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

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($scope, $timeout, $state){
  // Form data for the login modal
  $scope.loginData = {};
  $scope.estado = 'login';

  $scope.Logout = function() {
    firebase.auth().signOut()
    .then(function(){
      //Estamos deslogueados
      console.log("Adios");
      //CurrentUser tiene los datos de la sesión. Si no hay sesión activa, muestra null.
      console.info(firebase.auth().currentUser);
      $timeout(function(){
          $scope.estado = 'login';
      }, 1000);
    }, function(error){
      //Error en deslogueo
      console.log("Error");
    });
  };

  $scope.doLogin = function() {
  
    //Le paso por código las credenciales así no tengo que tipearlas
    //$scope.loginData.username= "ejemplo@adminfirebase.com";
    //$scope.loginData.password= "12345678";
    
    console.log('Doing login', $scope.loginData);

    //Llamo a la función de Firebase que comprueba las credenciales por el método mail y password.
    //Esta función va a recibir como parámetro el username y la contraseña.
    //Si no son correctos los datos, llama a catch. Puede ser error de usuario o de contraseña.
    //Los errores pueden ser: usuario no existente, contraseña inválida, mail con mal formato.
    //Independientemente de lo que resulte, lama a then. Si fue correcto, en "respuesta" almaceno todos los datos. En respuesta.providerData tengo un array con la información del log.
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
    .catch(function(error){
        //NO SE PUDO LOGUEAR
        //Muestro por consola
        console.info(error);

        //Muestro un alert con el tipo de error
        switch(error.code){
            case "auth/invalid-email":
              alert("Mail con formato incorrecto");
              break;
            case "auth/user-not-found":
              alert("El usuario ingresado no existe");
              break;
            case "auth/wrong-password":
              alert("Contraseña incorrecta");
              break;
            default:
              alert("Error");
              break;
        }
    })
    .then(function(respuesta){
      //ACÁ ENTRA SIEMPRE
      //Pongo todo el código en un timeout para evitar problemas de sincronización
      $timeout(function(){
        //Evalúo si respuesta está cargada con los datos de sesión
        if(respuesta != undefined)
        {
          //SE LOGUEÓ
          console.info("Bienvenido", respuesta);
          //Podría redirigir a otro state
          //$state.go("app.playlists");
          //O también cambiar 'estado' para mostrar otra parte de código HTML en este mismo template
          $scope.estado = 'logueado';
        }
        else
        {
          //NO SE LOGUEÓ
          console.info("Error de ingreso", respuesta);
        }
      }, 1000);
    });
  };

  $scope.ResetearClave = function(){
      firebase.auth().sendPasswordResetEmail($scope.loginData.username)
      .then(function(){
          console.log("Revisar el correo");
      }, function(error){
          console.info(error);
      });
  };

});

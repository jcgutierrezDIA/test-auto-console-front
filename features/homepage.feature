Feature: Console Home Page
  Como usuario de la Consola
  Quiero navegar por el menú
  Para acceder a las diferentes funcionalidades

  @login
  Scenario: Verificar autenticación exitosa
    Given Estoy autenticado en la Consola
    Then Espero que la autenticación sea exitosa

  @menu
  Scenario: Navegar al Panel de Transporte
    Given Estoy autenticado en la Consola
    When Hago clic en el menú
    And Selecciono la opción "Panel de Transporte"
    Then Espero que "Alta" sea visible 
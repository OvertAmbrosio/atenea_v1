import random
import json
import requests
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
# DECLARAR EL OBJETO A ENVIAR COMO LOGGER
data = {};
url = "http://localhost:4000/api/ordenes";
# FUNCIONA DE 5AM - 11PM
carpetaHoy = datetime.today().strftime('%d_%m_%y');
carpetaHora = datetime.today().strftime('%H_%M');
# INICIALIZAR LAS OPCIONES DE CHROME
chrome_options = webdriver.ChromeOptions()
prefs = {'download.default_directory' : r"D:\Atenea_v1\atenea_v1\scraping\selenium"+"\\"+carpetaHoy+"\\"+carpetaHora};
chrome_options.add_experimental_option('prefs', prefs)
# INICIALIZAR EL DRIVER DE CHROME
driver = webdriver.Chrome(executable_path='D:\Atenea_v1\\atenea_v1\scraping\selenium\chromedriver.exe', options=chrome_options)
#ABRIR LA WEB DEL TOA
driver.get('https://telefonica-pe.etadirect.com/mobility/');
# ESPERAR SI CARGA EL INPUT USERNAME
WebDriverWait(driver, 20).until(
    EC.element_to_be_clickable((By.XPATH, '//input[@id="username"]'))
  )
#OBTENER EL USERNAME, PASSWORD Y BOTON DE SUBMIT
username = driver.find_element_by_xpath('//input[@id="username"]');
password = driver.find_element_by_xpath('//input[@id="password"]');
submit = driver.find_element_by_xpath('//button[@name="user_submitted_login_form"]')
# ENVIAR LAS CLAVES DE ACCESO
username.send_keys("LY0462");
password.send_keys("H4nz*1220");

submit.click();
# CREAR FUNCION 
def extraerExcel():
  WebDriverWait(driver, 20).until(
    EC.element_to_be_clickable((By.XPATH, '//button[@data-label-pid="6614"]'))
  )
  try:
    sleep(2);
    limaMenu = driver.find_element_by_xpath('//button[@data-label-pid="6614"]');
    limaMenu.click()
    limaArrow = driver.find_element_by_xpath('//button[@aria-label="Ampliar"]');
    limaArrow.click()
    data["lima_menu_success"] = "Menú Lima clickeado y accedido con exito";
  except:
    data["lima_menu_error"] = "Error obteniendo accediendo al menú Lima";
    pass;
    # ESPERAR QUE SE HABILITE EL SUBMENU
  try:
    WebDriverWait(driver, 30).until(
      EC.element_to_be_clickable((By.XPATH, '//div[@data-id="6761"]'))
    )
    zonalMenu = driver.find_element_by_xpath('//div[@data-id="6761"]');
    zonalMenu.click();
    sleep(1);
    zonalArrow = driver.find_element_by_xpath('//div[@data-id="6761"]/div/button[@aria-label="Ampliar"]');
    zonalArrow.click();
    data["zonal_menu_success"] = "Menú Zonal clickeado y accedido con exito";
    sleep(2);
  # SI NO SE HABILITA CERRAR
  except:
    data["zonal_menu_error"] = "Menú Zonal clickeado y accedido con exito";
    pass;
  # ESPERAR QUE SE HABILITE EL SUBMENU MODELO
  try:
    WebDriverWait(driver, 10).until(
      EC.element_to_be_clickable((By.XPATH, '//div[@data-id="6762"]'))
    )
    nuevoModelo = driver.find_element_by_xpath('//div[@data-id="6762"]');
    nuevoModelo.click();
    data["nuevo_modelo_menu_success"] = 'Nuevo modelo encontrado y clickeado';
    sleep(2);
  # SI NO SE HABILITA CERRAR
  except:
    data["nuevo_modelo_menu_error"] = 'No se encuentra el menu de modelo nuevo';
    pass;
  # COMPROBAR SI EXISTE ALGUN AVISO
  noDataDiv = driver.find_element_by_xpath('//div[@id="notification-message"]');
  noDataButton = driver.find_element_by_xpath('//input[@id="notification-clear"]');
  if noDataButton:
    claseDataDiv = noDataDiv.get_attribute("class");
    if claseDataDiv != "hidden":
      noDataButton.click();
  #HABILITAR FILTROS
  sleep(2);
  accionesMenu = driver.find_element_by_xpath('//button[@data-ctrl-id="114"]');
  accionesMenu.click();
  data["boton_filtros_success"] = "Click en boton FILTROS."
  sleep(2)
  accionesMenu = driver.find_element_by_xpath('//input[@name="recursively"]');
  accionesMenu.click();
  data["checkbox_datos_success"] = "Check en datos e hijos."
  sleep(1)
  accionesMenu = driver.find_element_by_xpath('//button[@name="apply"]');
  accionesMenu.click();
  data["boton_aplicar_success"] = "Click en boton aplicar."
  # CLICK EN EL MENU RESPONSIVE
  sleep(5);
  accionesMenu = driver.find_element_by_xpath('//button[@data-ctrl-id="131"]');
  accionesMenu.click();
  data["boton_acciones_success"] = "Click en boton acciones."
  sleep(2);
  # CLICK EN EXPORTAR
  exportarMenu = driver.find_element_by_xpath('//div[@aria-label="Exportar"]');
  exportarMenu.click();
  data["boton_exportar_success"] = "Click en exportar."
  # ESPERAR QUE DESCARGUE
  sleep(5);

# COMPROBAR SI EXISTE EL BOTON DE MENU
try:
  extraerExcel();
except:
  pass;
  try:
    otherPassword = driver.find_element_by_xpath('//input[@id="password"]');
    otherPassword.send_keys("Movistar2020");
    inputSession = driver.find_element_by_xpath('//div[@class="form-row checkbox-with-label"]');
    inputSession.click();
    otherSubmit = driver.find_element_by_xpath('//button[@name="user_submitted_login_form"]');
    try:
      otherSubmit.click();
      data["submit_1_success"] = "Primer click"
      sleep(2)
      try:
        extraerExcel();
      except:
        sleep(2);
        data["lima_menu_1_error"] = "Error ejecutando la funcion";
        pass
        try:
          extraerExcel();
        except:
          data["lima_menu_2_error"] = "Error ejecutando la funcion 2° vez";
          pass
    except:
      data["lima_menu_3_error"] = "Error ejecutando la funcion 3° vez";
      pass
  except:
    sleep(2);
    otherPassword = driver.find_element_by_xpath('//input[@id="password"]');
    otherPassword.send_keys("Movistar2020");
    checkInput = driver.find_element_by_xpath('//div[@class="form-row checkbox-with-label"]');
    checkInput.click();
    data["check_input_success"] = "Check para cerrar sesiones antiguas.";
    otherSubmit = driver.find_element_by_xpath('//button[@name="user_submitted_login_form"]');
    sleep(1);
    pass;
    try:
      otherSubmit.click();
      data["submit_2_success"] = "Segundo intento de inicio de sesión luego del primero.";
      sleep(2)
      extraerExcel();
    except:
      data["submit_2_error"] = "Error luego del segundo intento de loggin.";
      pass;
# FINALIZAR EL SCRIPT ENVIANDO LA PETICION POST
# json_data = json.dumps(data);
file_path = "D:\Atenea_v1\\atenea_v1\scraping\selenium\\"+carpetaHoy+"\\"+carpetaHora+"\Actividades-Nuevo Modelo_"+carpetaHoy+".csv";
files = {'file': open(file_path, 'rb')};
try:
  print('enviando la peticion');
  r = requests.post(url, files=files, data=data);
  print('se recibe la peticion');
  print(r.text);
  pass;
except requests.exceptions.RequestException as e:
  print('Error en enviando la peticion');
  print(e);
  pass;
except:
  print('Error fuera de la peticion');
  pass;

driver.close();
    
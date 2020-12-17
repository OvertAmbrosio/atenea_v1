import sys
import random
import json
import requests
import argparse
from random import randint
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

parser = argparse.ArgumentParser(description='Short sample app')
parser.add_argument('--user')
parser.add_argument('--psw')
args = parser.parse_args()

chrome_options = webdriver.ChromeOptions()
prefs = {'download.default_directory' : r"D:\Atenea_v1\atenea_v1\scraping\selenium"+"\\"+carpetaHoy+"\\"+carpetaHora};
chrome_options.add_experimental_option('prefs', prefs)
# INICIALIZAR EL DRIVER DE CHROME
driver = webdriver.Chrome(executable_path='D:/Atenea_v1/atenea_v1/scraping/dist/script/chromedriver.exe', options=chrome_options)
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
username.send_keys(args.user);
password.send_keys(args.psw);

submit.click();
# CREAR FUNCION 
def extraerExcel():
  value = randint(2, 8)
  # ESPERAR QUE SE HABILITE EL SUBMENU MODELO
  try:
    WebDriverWait(driver, 10).until(
      EC.element_to_be_clickable((By.XPATH, '//button[@data-label-pid="6762]'))
    )
    nuevoModelo = driver.find_element_by_xpath('//button[@data-label-pid="6762"]');
    nuevoModelo.click();
    data["nuevo_modelo_menu_success"] = 'Nuevo modelo encontrado y clickeado';
    value = randint(2, 8)
    sleep(value);
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
  value = randint(2, 8)
  accionesMenu = driver.find_element_by_xpath('//button[@data-ctrl-id="114"]');
  accionesMenu.click();
  data["boton_filtros_success"] = "Click en boton FILTROS."
  value = randint(2, 8)
  sleep(value);
  accionesMenu = driver.find_element_by_xpath('//input[@name="recursively"]');
  accionesMenu.click();
  data["checkbox_datos_success"] = "Check en datos e hijos."
  value = randint(2, 8)
  sleep(value);
  accionesMenu = driver.find_element_by_xpath('//button[@name="apply"]');
  accionesMenu.click();
  data["boton_aplicar_success"] = "Click en boton aplicar."
  # CLICK EN EL MENU RESPONSIVE
  value = randint(4, 8)
  sleep(value);
  accionesMenu = driver.find_element_by_xpath('//button[@data-ctrl-id="131"]');
  accionesMenu.click();
  data["boton_acciones_success"] = "Click en boton acciones."
  sleep(value);
  # CLICK EN EXPORTAR
  exportarMenu = driver.find_element_by_xpath('//div[@aria-label="Exportar"]');
  exportarMenu.click();
  data["boton_exportar_success"] = "Click en exportar."
  # ESPERAR QUE DESCARGUE
  value = randint(4, 8)
  sleep(value);

# COMPROBAR SI EXISTE EL BOTON DE MENU
try:
  extraerExcel();
except:
  pass;
  try:
    otherPassword = driver.find_element_by_xpath('//input[@id="password"]');
    otherPassword.send_keys(args.psw);
    inputSession = driver.find_element_by_xpath('//div[@class="form-row checkbox-with-label"]');
    inputSession.click();
    otherSubmit = driver.find_element_by_xpath('//button[@name="user_submitted_login_form"]');
    try:
      otherSubmit.click();
      data["submit_1_success"] = "Primer click"
      value = randint(2, 8)
      sleep(value);
      try:
        extraerExcel();
      except:
        sleep(value);
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
    sleep(value);
    otherPassword = driver.find_element_by_xpath('//input[@id="password"]');
    otherPassword.send_keys(args.psw);
    checkInput = driver.find_element_by_xpath('//div[@class="form-row checkbox-with-label"]');
    checkInput.click();
    data["check_input_success"] = "Check para cerrar sesiones antiguas.";
    otherSubmit = driver.find_element_by_xpath('//button[@name="user_submitted_login_form"]');
    sleep(1);
    pass;
    try:
      otherSubmit.click();
      data["submit_2_success"] = "Segundo intento de inicio de sesión luego del primero.";
      value = randint(2, 6)
      sleep(value);
      extraerExcel();
    except:
      data["submit_2_error"] = "Error luego del segundo intento de loggin.";
      pass;
# FINALIZAR EL SCRIPT ENVIANDO LA PETICION POST
# json_data = json.dumps(data);
sleep(8);
file_path = "D:\Atenea_v1\\atenea_v1\scraping\selenium\\"+carpetaHoy+"\\"+carpetaHora+"\Actividades-Nuevo Modelo_"+carpetaHoy+".csv";
files = {'file': open(file_path, 'rb')};
try:
  data["request_status"] = 'enviando la peticion';
  r = requests.post(url, files=files, data=data);
  data["request_respuesta"] = 'se recibe la peticion';
  data["status"] = r.text;
  pass;
except requests.exceptions.RequestException as e:
  data["request_status"] = 'Error en enviando la peticion';
  pass;
except:
  data["request_status"] = 'Error fuera de la peticion';
  pass;

if r.text == 'error':
  print(data)
  sys.stderr.flush();
  driver.close();
  
print(data);
sys.stdout.flush();

driver.close();
    
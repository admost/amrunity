var uFlag = 0;
var andrArr = [];
var iosArr = [];
var selectedIDS = [];
var allSelectedNetworks = [];
var adNetworkArrayAndroid;
var adNetworkArrayIos;
var androidDependencyEntries = [];
var androidRepoEntries = [];
var combinedData = [];
var dataAndroid;
var dataIOS;

function amrInitPage() {
  var responseIOS = httpGet("https://admost.github.io/amrios/networks.json");
  dataAndroid = getAndroidNetworks();
  dataIOS = JSON.parse(responseIOS);

  combinedData = combineDatas();

  fillAdNetworkList();
}

function amrInitAndroid(android_data) {
  adNetworkArrayAndroid = android_data;
}

function amrInitIos(data) {
  adNetworkArrayIos = data['adNetworks'];
}

function getNetworks(obj) {
  return JSON.parse(obj);
}

function getSelectedAndroidNetworks() {
  return andrArr;
}

function getSelectedIosNetworks() {
  return iosArr;
}


function combineDatas() {
  var datas = new Array();

  dataAndroid.ad_networks.forEach(element => {

    var name = element.name.toUpperCase();

    var adNetwork = {
      name: name,
      android: {
        name: element.name,
        adapterVersion: element.adapterVersion,
        app_gradle: element.app_gradle,
        project_gradle: element.project_gradle,
        android_manifest: element.android_manifest,
        unitySupport: element.unitySupport,
        status: element.status
      },
      ios: {
        SDKVersion: "",
        adapterName: "",
        adapterVersion: "",
        displayName: "",
        infoPlistKey: "",
        initParameterCount: 1,
        iosSupport: true,
        minTargetSdk: "",
        network: "",
        podVersion: "",
        skadnetworkIDS: [],
        status: false,
        supportedAdTypes: [],
        unitySupport: true
      }
    }

    var el = dataIOS.adNetworks.find((value, index) => value.network.includes(element.name));

    if (typeof el != "undefined") {

      adNetwork.ios.SDKVersion = el.SDKVersion;
      adNetwork.ios.adapterName = el.adapterName;
      adNetwork.ios.adapterVersion = el.adapterVersion;
      adNetwork.ios.displayName = el.displayName;
      adNetwork.ios.infoPlistKey = el.infoPlistKey;
      adNetwork.ios.initParameterCount = el.initParameterCount;
      adNetwork.ios.iosSupport = el.iosSupport;
      adNetwork.ios.minTargetSdk = el.minTargetSdk;
      adNetwork.ios.network = el.network;
      adNetwork.ios.podVersion = el.podVersion;
      adNetwork.ios.skadnetworkIDS = el.skadnetworkIDS;
      adNetwork.ios.status = el.status;
      adNetwork.ios.supportedAdTypes = el.supportedAdTypes;
      adNetwork.ios.unitySupport = el.unitySupport;
    }
    datas.push(adNetwork);

  });

  dataIOS.adNetworks.forEach(element => {

    var el = datas.find((value, index) => value.name != "ADMOB-17.2.0" && value.name.includes(element.network));

    if (typeof el != "undefined") {
      el.ios.SDKVersion = element.SDKVersion;
      el.ios.adapterName = element.adapterName;
      el.ios.adapterVersion = element.adapterVersion;
      el.ios.displayName = element.displayName;
      el.ios.infoPlistKey = element.infoPlistKey;
      el.ios.initParameterCount = element.initParameterCount;
      el.ios.iosSupport = element.iosSupport;
      el.ios.minTargetSdk = element.minTargetSdk;
      el.ios.network = element.network;
      el.ios.podVersion = element.podVersion;
      el.ios.skadnetworkIDS = element.skadnetworkIDS;
      el.ios.status = element.status;
      el.ios.supportedAdTypes = element.supportedAdTypes;
      el.ios.unitySupport = element.unitySupport;

    } else {
      var adNetwork = {
        name: element.network,
        android: {
          app_gradle: "",
          project_gradle: "",
          status: false,
          adapterVersion: "",
          unitySupport: false,
          android_manifest: "",
        },
        ios: {
          SDKVersion: element.SDKVersion,
          adapterName: element.adapterName,
          adapterVersion: element.adapterVersion,
          displayName: element.displayName,
          infoPlistKey: element.infoPlistKey,
          initParameterCount: element.initParameterCount,
          iosSupport: element.iosSupport,
          minTargetSdk: element.minTargetSdk,
          network: element.network,
          podVersion: element.podVersion,
          skadnetworkIDS: element.skadnetworkIDS,
          status: element.status,
          supportedAdTypes: element.supportedAdTypes,
          unitySupport: element.unitySupport,
        }
      }
      var el = dataAndroid.ad_networks.find((value, index) => value.name.toUpperCase() == element.name);

      if (typeof el != "undefined") {
        adNetwork.android.app_gradle = el.app_gradle;
        adNetwork.android.project_gradle = el.project_gradle;
        adNetwork.android.status = el.status;
        adNetwork.android.adapterVersion = el.adapterVersion;
        adNetwork.android.android_manifest = el.android_manifest;
        adNetwork.android.unitySupport = el.unitySupport;
      }

      datas.push(adNetwork);
    }

  });
  datas.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  return datas;
}

function fillAdNetworkList() {
  htmlString = "";
  var amrel = `<tr>
    <td><span class="label label-danger">Required</span></td>
    <td>Unity Core</td>
    <td colspan="2" class="text-center">
       <button type="button" onclick="toggleAdNetworkStatus('core_unity');" id="core_unity" class="btn btn-outline btn-block btn-primary"><i
                style="padding-right: 16px;" class="fa fa-android"></i>/<i
                style="padding-left: 16px;" class="fa fa-apple"></i>&nbsp;&nbsp;v.1.6.4</button>
    </td>
</tr>`;
  htmlString = amrel;

  combinedData.forEach(element => {
    if (element.name == "AMR") {
      return;
    }

    var iosButton = '<td class="text-right"></td>';
    var androidButton = '<td class="text-right"></td>';;
    if ((typeof element.ios.adapterVersion != "undefined") && element.ios.adapterVersion != "" && element.ios.unitySupport == true) {
      iosButton = `<td class="text-right">
              <button type="button" onclick="toggleAdNetworkStatus('`+ element.name + `_ios');" id="` + element.name + `_ios" class="btn btn-outline btn-block btn-default">
              <i class="fa fa-apple"></i>&nbsp;&nbsp;`+ element.ios.adapterVersion + `</button>
          </td>`
    }

    if ((typeof element.android.adapterVersion != "undefined") && element.android.adapterVersion != "" && element.android.unitySupport == true) {
      androidButton = `<td class="text-right">
              <button type="button" onclick="toggleAdNetworkStatus('`+ element.name + `_android');" id="` + element.name + `_android" class="btn btn-outline btn-block btn-success"><i
                  class="fa fa-android"></i>&nbsp;&nbsp;`+ element.android.adapterVersion + `</button>
              </td>`
    }

    var displayName = ""
    if ((typeof element.ios.displayName != "undefined") && element.ios.displayName != "") {
      displayName = element.ios.displayName;
    } else {
      displayName = element.android.name;
    }

    if (androidButton != '<td class="text-right"></td>' || iosButton != '<td class="text-right"></td>') {
      htmlString = htmlString + `<tr><td><span class="label label-success">Optional</span></td>
      <td>`+ displayName + `</td>
      `+ androidButton + iosButton + `
    </tr>`;
    }

  });

  $("#adnetwork-table tbody").append(htmlString);

}


function getNetworkInfo(isAndroid, networkName) {
  var found = false;
  var i;
  if (isAndroid) {
    for (i = 0; i < adNetworkArrayAndroid.length; i++) {
      if (adNetworkArrayAndroid[i].name.toLowerCase() === networkName.toLowerCase()) {
        return adNetworkArrayAndroid[i];
      }
    }
  } else {
    for (i = 0; i < adNetworkArrayIos.length; i++) {
      if (adNetworkArrayIos[i].displayName.toLowerCase() === networkName.toLowerCase()) {
        return adNetworkArrayIos[i];
      }
    }
  }
  return undefined;
}

function getIosResolverEnrty(networkName) {
  var networkInfo = getNetworkInfo(false, networkName);
  if (networkInfo !== undefined) {
    return '<iosPod name="' + networkInfo['adapterName'] + '" version="' + '~> ' + networkInfo['podVersion'] + '" minTargetSdk="' + networkInfo['minTargetSdk'] + '"/>';
  } else {
    return "ERROR ios: " + networkName;
  }
}

function getAndroidResolverEnrty(networkName) {
  var i;
  var result = '';
  var networkInfo = getNetworkInfo(true, networkName);
  if (networkInfo !== undefined) {
    // <androidPackage spec="android.arch.core:common:1.1.0"/>
    for (i = 0; i < networkInfo.app_gradle.dependencies.length; i++) {
      var dep = networkInfo.app_gradle.dependencies[i].package;
      result += '\n\t\t<androidPackage spec="' + dep + '"/>';
    }
    if (networkInfo.app_gradle.dependencies_unity !== undefined) {
      for (i = 0; i < networkInfo.app_gradle.dependencies_unity.length; i++) {
        dep = networkInfo.app_gradle.dependencies_unity[i].package;
        result += '\n\t\t<androidPackage spec="' + dep + '"/>';
      }
    }
    return result;
  } else {
    return "ERROR android: " + networkName;
  }
}

function getAndroidResolverRepoEnrty(networkName) {
  var i;
  var result = '';
  var networkInfo = getNetworkInfo(true, networkName);
  if (networkInfo !== undefined) {
    if (networkInfo.project_gradle === undefined) {
      return '';
    }
    // <androidPackage spec="android.arch.core:common:1.1.0"/>
    for (i = 0; i < networkInfo.project_gradle.dependencies.length; i++) {
      var dep = networkInfo.project_gradle.dependencies[i].maven;
      if (dep == undefined) {
        continue;
      }
      result += '<repository>' + dep + '</repository>';
    }
    return result;
  } else {
    return "ERROR android: " + networkName;
  }
}

function getAmrDependenciesFile() {
  if (!andrArr.includes('AMR') && andrArr.length !== 0) {
    andrArr.unshift('AMR');
  }
  if (!iosArr.includes('AMR') && iosArr.length !== 0) {
    iosArr.unshift('AMR');
  }
  var i;
  var result = '<dependencies>\n';
  result += '\t<iosPods>\n';
  for (i = 0; i < iosArr.length; i++) {
    result += '\t\t' + getIosResolverEnrty(iosArr[i]) + '\n';
  }
  //result += '\t\t<sources>\n\t\t\t<source>https://cocoapods.mycompany.com/Specs</source>\n\t\t</sources>\n'
  result += '\n\t</iosPods>\n\t<androidPackages>';
  for (i = 0; i < andrArr.length; i++) {
    if (!androidDependencyEntries.includes(getAndroidResolverEnrty(andrArr[i])) && andrArr[i] !== 'AMR') {
      androidDependencyEntries.push(getAndroidResolverEnrty(andrArr[i]));
      result += getAndroidResolverEnrty(andrArr[i]);
    } else {
      result += getAndroidResolverEnrty(andrArr[i]);
    }
  }

  result += '\n\t\t<repositories>\n'
  for (i = 0; i < andrArr.length; i++) {
    if (getAndroidResolverRepoEnrty(andrArr[i]) === '') {
      continue;
    }
    if (!androidRepoEntries.includes(getAndroidResolverRepoEnrty(andrArr[i])) && andrArr[i] !== 'AMR') {
      androidDependencyEntries.push(getAndroidResolverRepoEnrty(andrArr[i]));
      result += '\t\t\t' + getAndroidResolverRepoEnrty(andrArr[i]) + '\n';
    } else {
      result += '\t\t\t' + getAndroidResolverRepoEnrty(andrArr[i]) + '\n';
    }
  }
  result += '\t\t</repositories>\n\t</androidPackages>\n</dependencies>';
  if (andrArr.includes('AMR')) {
    andrArr.shift();
  }
  if (iosArr.includes('AMR')) {
    iosArr.shift();
  }

  return result;
}

/////////// Old methods

function includes(container, value) {
  var returnValue = false;
  var pos = container.indexOf(value);
  if (pos >= 0) {
    returnValue = true;
  }
  return returnValue;
}

function openWindowWithPost(url, data) {
  var form = document.createElement("form");
  form.target = "print_popup";
  form.method = "POST";
  form.action = url;
  form.style.display = "none";
  form.onsubmit = function () { window.open('about:blank', 'print_popup', 'width=1000,height=800') };

  for (var key in data) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function downloadPackage() {
  var fileCont = getAmrDependenciesFile();
  console.log(fileCont);

  var form = document.createElement("form");
  form.target = "print_popup";
  form.method = "POST";
  form.action = "https://download.admost.com/Main.aspx";
  form.style.display = "none";
  form.onsubmit = function () { window.open('about:blank', 'print_popup', 'width=1000,height=800') };

  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "dependencies";
  input.value = fileCont;
  form.appendChild(input);

  var input2 = document.createElement("input");
  input2.type = "hidden";
  input2.name = "hasCore";
  input2.value = uFlag;
  form.appendChild(input2);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

}

function closeList() {
  andrArr = [];
  iosArr = [];
  uFlag = 0;
  for (var i = 0; i < selectedIDS.length; i++) {
    var selectedTemp = document.getElementById(selectedIDS[i]);
    selectedTemp.style.backgroundColor = "";
    selectedTemp.style.color = "";
    selectedTemp.blur();
  }
  selectedIDS = [];

  update();
}



function update() {
  if ((andrArr.length + iosArr.length == 0) && uFlag == 0) {
    document.getElementById('myPanel').style.display = 'none';
  }

  else {
    document.getElementById('myPanel').style.display = 'block';
  }

  var table = document.getElementById("selectedTable");
  table.innerHTML = "";


  allSelectedNetworks = andrArr.slice(0);

  for (var i = 0; i < iosArr.length; i++) {
    /*if(allSelectedNetworks.includes(iosArr[i])==false)
    {
      allSelectedNetworks.push(iosArr[i]);
    }*/

    if (includes(allSelectedNetworks, iosArr[i]) == false) {
      allSelectedNetworks.push(iosArr[i]);
    }

  }
  allSelectedNetworks.sort();

  if (uFlag == 1) {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(0);
    var cell3 = row.insertCell(0);
    var cell0 = row.insertCell(0);

    cell0.innerHTML = '<span class="fa fa-remove" style="color:red; cursor:pointer;" onclick="deleteTableItem(\'u\');" ></span>';
    cell3.innerHTML = "Unity Core";
    cell2.innerHTML = '<span class="fa fa-android" style = "color:#2196F3;"> </span>';
    cell1.innerHTML = '<span class="fa fa-apple" style = "color:#2196F3;"></span>';

  }

  for (var i = 0; i < allSelectedNetworks.length; i++) {
    var ifand = includes(andrArr, allSelectedNetworks[i]);
    var ifios = includes(iosArr, allSelectedNetworks[i]);
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(0);
    var cell3 = row.insertCell(0);
    var cell0 = row.insertCell(0);


    cell3.innerHTML = allSelectedNetworks[i].replace("-17.2.0", "");
    cell0.innerHTML = '<span class="fa fa-remove" style="color:red; cursor:pointer;" onclick="deleteTableItem(\'' + allSelectedNetworks[i] + '\');" ></span>';

    if (ifand) {
      cell2.innerHTML = '<span class="fa fa-android" style = "color:#43A047;"></span>';
    }

    if (ifios) {
      cell1.innerHTML = '<span class="fa fa-apple" style = "color:#777777;"></span>';
    }
  }

  fillIos14FileCode();
}

function deleteTableItem(item) {
  if (item == "u") {
    var unityBut = document.getElementById('core_unity');
    unityBut.style.backgroundColor = "";
    unityBut.style.color = "";
    unityBut.blur();
    uFlag = 0;
    selectedIDS.splice(selectedIDS.indexOf("core_unity"), 1);
  }

  var ifAndroid = includes(andrArr, item);
  var ifIos = includes(iosArr, item);
  if (ifAndroid) {
    var id = item + "_android";
    var but = document.getElementById(id);
    but.style.backgroundColor = "";
    but.style.color = "";
    but.blur();
    andrArr.splice(andrArr.indexOf(item), 1);
    selectedIDS.splice(selectedIDS.indexOf(id), 1);
  }
  if (ifIos) {
    var id = item + "_ios";
    var but = document.getElementById(id);
    but.style.backgroundColor = "";
    but.style.color = "";
    but.blur();
    iosArr.splice(iosArr.indexOf(item), 1);
    selectedIDS.splice(selectedIDS.indexOf(id), 1);
  }
  update();
}


function toggleAdNetworkStatus(id) {
  if (id == 'core_unity') {
    var unityBut = document.getElementById('core_unity');

    if (uFlag == 0) {

      unityBut.style.backgroundColor = "#2196F3";
      unityBut.style.color = "#ffffff";
      uFlag = 1;
      selectedIDS.push(id);
    }
    else if (uFlag == 1) {

      unityBut.style.backgroundColor = "";
      unityBut.style.color = "";
      unityBut.blur();
      uFlag = 0;
      selectedIDS.splice(selectedIDS.indexOf(id), 1);
    }
    update();

  } else {
    var ifAndroid = (id.split("_")[1] == "android");
    var but = document.getElementById(id);

    if (ifAndroid == true) {
      var listElement = id.split("_")[0];
      if (includes(andrArr, listElement) == false) {
        but.style.backgroundColor = "#43A047";
        but.style.color = "#ffffff";
        andrArr.push(listElement);
        selectedIDS.push(id);
        if (uFlag == 0) {
          toggleAdNetworkStatus("core_unity");
        }
      } else {
        but.style.backgroundColor = "";
        but.style.color = "";
        but.blur();
        andrArr.splice(andrArr.indexOf(listElement), 1);
        selectedIDS.splice(selectedIDS.indexOf(id), 1);
      }

      update();
    } else {
      var listElement = id.split("_")[0];
      if (includes(iosArr, listElement) == false) {
        but.style.backgroundColor = "#777777";
        but.style.color = "#ffffff";
        iosArr.push(listElement);
        selectedIDS.push(id);

        if (uFlag == 0) {
          toggleAdNetworkStatus("core_unity");
        }
      } else {
        but.style.backgroundColor = "";
        but.style.color = "";
        but.blur();
        iosArr.splice(iosArr.indexOf(listElement), 1);
        selectedIDS.splice(selectedIDS.indexOf(id), 1);
      }
      update();
    }
  }
}

function fillIos14FileCode() {
  var finalValues = [];

  var sortedArr = iosArr.sort();

  for (var i = 0; i < sortedArr.length; i++) {
    for (var j = 0; j < adNetworkArrayIos.length; j++) {
      if (adNetworkArrayIos[j].displayName == sortedArr[i]) {
        for (k = 0; k < adNetworkArrayIos[j].skadnetworkIDS.length; k++) {
          if (!includesUpper(finalValues, adNetworkArrayIos[j].skadnetworkIDS[k])) {
            finalValues.push(adNetworkArrayIos[j].skadnetworkIDS[k]);
          }
        }
      }
    }
  }

  var finalXMLStr = "<key>SKAdNetworkItems</key>\n<array>\n";

  for (var i = 0; i < finalValues.length; i++) {
    finalXMLStr += "\t<dict>\n\t\t<key>SKAdNetworkIdentifier</key>\n\t\t<string>" + finalValues[i] + "</string>\n\t</dict>\n";
  }

  finalXMLStr += "</array>\n"

  $('#file-ios-14').text(finalXMLStr);
}

function includesUpper(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].toUpperCase() == item.toUpperCase()) return true;
  }
  return false;
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

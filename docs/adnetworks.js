var uFlag=0;
var andrArr = [];
var iosArr = [];
var selectedIDS = [];
var allSelectedNetworks = [];
var adNetworkArrayAndroid;
var adNetworkArrayIos;
var androidDependencyEntries =[];
var androidRepoEntries =[];

function amrInitAndroid(android_data) {
  adNetworkArrayAndroid = android_data;
}

function amrInitIos(ios_data) {
  adNetworkArrayIos = ios_data;
}

function getSelectedAndroidNetworks() {
  return andrArr;
}

function getSelectedIosNetworks() {
  return iosArr;
}

function getNetworkInfo(isAndroid, networkName) {
    var found = false;
    var i;
    if(isAndroid) {
      for(i = 0; i < adNetworkArrayAndroid.length; i++) {
        if (adNetworkArrayAndroid[i].name.toLowerCase() === networkName.toLowerCase()) {
            return adNetworkArrayAndroid[i];
        }
      }
    }else {
      for(i = 0; i < adNetworkArrayIos.length; i++) {
        if (adNetworkArrayIos[i].name.toLowerCase() === networkName.toLowerCase()) {
            return adNetworkArrayIos[i];
        }
      }
    }
    return undefined;
}

function getIosResolverEnrty(networkName) {
  var networkInfo = getNetworkInfo(false, networkName);
  if(networkInfo !== undefined) {
    return '<iosPod name="' + networkInfo['pod'] + '" version="' + '~> ' + networkInfo['version'] + '" minTargetSdk="' + networkInfo['minTargetSdk'] + '"/>';
  }else {
    return "ERROR ios: " + networkName;
  }
}

function getAndroidResolverEnrty(networkName) {
  var i;
  var result ='';
  var networkInfo = getNetworkInfo(true, networkName);
  if(networkInfo !== undefined) {
    // <androidPackage spec="android.arch.core:common:1.1.0"/>
    for(i =0; i < networkInfo.app_gradle.dependencies.length; i++) {
      var dep = networkInfo.app_gradle.dependencies[i].package;
      result += '\n\t\t<androidPackage spec="' + dep + '"/>';
    }
    if(networkInfo.app_gradle.dependencies_unity !== undefined) {
      for(i =0; i < networkInfo.app_gradle.dependencies.length; i++) {
        dep = networkInfo.app_gradle.dependencies_unity[i].package;
        result += '\n\t\t<androidPackage spec="' + dep + '"/>';
      }
    }
    return result;
  }else {
    return "ERROR android: " + networkName;
  }
}

function getAndroidResolverRepoEnrty(networkName) {
  var i;
  var result ='';
  var networkInfo = getNetworkInfo(true, networkName);
  if(networkInfo !== undefined) {
    if(networkInfo.project_gradle === undefined) {
      return '';
    }
    // <androidPackage spec="android.arch.core:common:1.1.0"/>
    for(i =0; i < networkInfo.project_gradle.dependencies.length; i++) {
      var dep = networkInfo.project_gradle.dependencies[i].maven;
      if(dep == undefined) {
        continue;
      }
      result += '<repository>' + dep + '</repository>';
    }
    return result;
  }else {
    return "ERROR android: " + networkName;
  }
}

function getAmrDependenciesFile() {
  if(!andrArr.includes('AMR') && andrArr.length !== 0) {
    andrArr.unshift('AMR');
  }
  if(!iosArr.includes('AMR') && iosArr.length !== 0) {
    iosArr.unshift('AMR');
  }
  var i;
  var result = '<dependencies>\n';
  result += '\t<iosPods>\n';
  for(i = 0; i < iosArr.length; i++) {
    result += '\t\t'+ getIosResolverEnrty(iosArr[i]) + '\n';
  }
  //result += '\t\t<sources>\n\t\t\t<source>https://cocoapods.mycompany.com/Specs</source>\n\t\t</sources>\n'
  result += '\n\t</iosPods>\n\t<androidPackages>';
  for(i = 0; i < andrArr.length; i++) {
    if(!androidDependencyEntries.includes(getAndroidResolverEnrty(andrArr[i])) && andrArr[i] !== 'AMR') {
      androidDependencyEntries.push(getAndroidResolverEnrty(andrArr[i]));
      result += getAndroidResolverEnrty(andrArr[i]);
    } else {
      result += getAndroidResolverEnrty(andrArr[i]);
    }
  }

  result += '\n\t\t<repositories>\n'
  for(i = 0; i < andrArr.length; i++) {
    if(getAndroidResolverRepoEnrty(andrArr[i]) === '') {
      continue;
    }
    if(!androidRepoEntries.includes(getAndroidResolverRepoEnrty(andrArr[i])) && andrArr[i] !== 'AMR') {
      androidDependencyEntries.push(getAndroidResolverRepoEnrty(andrArr[i]));
      result += '\t\t\t'+ getAndroidResolverRepoEnrty(andrArr[i]) + '\n';
    } else {
      result += '\t\t\t'+ getAndroidResolverRepoEnrty(andrArr[i]) + '\n';
    }
  }
  result +='\t\t</repositories>\n\t</androidPackages>\n</dependencies>';
  if(andrArr.includes('AMR')){
    andrArr.shift();
  }
  if(iosArr.includes('AMR')){
    iosArr.shift();
  }

  return result;
}

/////////// Old methods

function includes(container, value)
{
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
  form.onsubmit=function(){window.open('about:blank','print_popup','width=1000,height=800')};

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

function downloadPackage()
{
  var fileCont = getAmrDependenciesFile();
  console.log(fileCont);

  var form = document.createElement("form");
  form.target = "print_popup";
  form.method = "POST";
  form.action = "http://download.admost.com/Main.aspx";
  form.style.display = "none";
  form.onsubmit=function(){window.open('about:blank','print_popup','width=1000,height=800')};

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


function closeList()
{
  andrArr = [];
  iosArr = [];
  uFlag = 0;
  for (var i=0 ; i<selectedIDS.length ; i++)
  {
    var selectedTemp = document.getElementById(selectedIDS[i]);
    selectedTemp.style.backgroundColor = "";
    selectedTemp.style.color = "";
    selectedTemp.blur();
  }
  selectedIDS = [];


  update();
}



function update()
{
  if((andrArr.length + iosArr.length == 0) && uFlag==0)
  {
    document.getElementById('myPanel').style.display='none';
  }

  else
  {
    document.getElementById('myPanel').style.display='block';
  }


  var table = document.getElementById("selectedTable");
  table.innerHTML="";


  allSelectedNetworks = andrArr.slice(0);

  for(var i=0; i< iosArr.length;i++)
  {
    /*if(allSelectedNetworks.includes(iosArr[i])==false)
    {
      allSelectedNetworks.push(iosArr[i]);
    }*/

    if(includes(allSelectedNetworks,iosArr[i])==false)
    {
      allSelectedNetworks.push(iosArr[i]);
    }

  }
  allSelectedNetworks.sort();

  if(uFlag==1)
  {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(0);
    var cell3 = row.insertCell(0);
    var cell0 = row.insertCell(0);

    cell0.innerHTML = '<span class="fa fa-remove" style="color:red; cursor:pointer;" onclick="deleteTableItem(\'u\');" ></span>';
    cell3.innerHTML = "Unity Core";
    cell2.innerHTML= '<span class="fa fa-android" style = "color:#2196F3;"> </span>';
    cell1.innerHTML = '<span class="fa fa-apple" style = "color:#2196F3;"></span>';

  }

  for (var i=0;i<allSelectedNetworks.length;i++)
  {
    var ifand = includes(andrArr,allSelectedNetworks[i]);
    var ifios = includes(iosArr,allSelectedNetworks[i]);
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(0);
    var cell3 = row.insertCell(0);
    var cell0 = row.insertCell(0);


    cell3.innerHTML = allSelectedNetworks[i];
    cell0.innerHTML = '<span class="fa fa-remove" style="color:red; cursor:pointer;" onclick="deleteTableItem(\'' + allSelectedNetworks[i] + '\');" ></span>';

    if(ifand)
    {
      cell2.innerHTML= '<span class="fa fa-android" style = "color:#43A047;"></span>';
    }

    if(ifios)
    {
      cell1.innerHTML = '<span class="fa fa-apple" style = "color:#777777;"></span>';
    }



  }


}

function deleteTableItem(item)
{
  if(item == "u")
  {
    var unityBut = document.getElementById('core_unity');
    unityBut.style.backgroundColor = "";
    unityBut.style.color = "";
    unityBut.blur();
    uFlag=0;
    selectedIDS.splice(selectedIDS.indexOf("core_unity"),1);
  }

    var ifAndroid = includes(andrArr,item);
    var ifIos = includes(iosArr,item);
    if(ifAndroid){
      var id=item+"_android";
      var but = document.getElementById(id);
      but.style.backgroundColor = "";
      but.style.color = "";
      but.blur();
      andrArr.splice(andrArr.indexOf(item), 1);
      selectedIDS.splice(selectedIDS.indexOf(id),1);
    }
    if(ifIos){
      var id=item+"_ios";
      var but = document.getElementById(id);
      but.style.backgroundColor = "";
      but.style.color = "";
      but.blur();
      iosArr.splice(iosArr.indexOf(item), 1);
      selectedIDS.splice(selectedIDS.indexOf(id),1);
    }


  update();
}


function toggleAdNetworkStatus(id)
{
  if(id=='core_unity')
  {
    var unityBut = document.getElementById('core_unity');

    if(uFlag==0)
    {

      unityBut.style.backgroundColor = "#2196F3";
      unityBut.style.color = "#ffffff";
      uFlag=1;
      selectedIDS.push(id);
    }
    else if(uFlag==1)
    {

      unityBut.style.backgroundColor = "";
      unityBut.style.color = "";
      unityBut.blur();
      uFlag=0;
      selectedIDS.splice(selectedIDS.indexOf(id),1);
    }
    update();

  }

  else
  {
    var ifAndroid = (id.split("_")[1] == "android");
    var but = document.getElementById(id);

    if(ifAndroid == true)
    {
      var listElement = id.split("_")[0];
      if(includes(andrArr,listElement) == false)
      {
        but.style.backgroundColor = "#43A047";
        but.style.color = "#ffffff";
        andrArr.push(listElement);
        selectedIDS.push(id);
          if(uFlag==0)
          {
            toggleAdNetworkStatus("core_unity");
          }
      }
      else
      {
        but.style.backgroundColor = "";
        but.style.color = "";
        but.blur();
        andrArr.splice(andrArr.indexOf(listElement), 1);
        selectedIDS.splice(selectedIDS.indexOf(id),1);
      }

      update();
    }
    else
    {
      var listElement = id.split("_")[0];
      if(includes(iosArr,listElement) == false)
      {
        but.style.backgroundColor = "#777777";
        but.style.color = "#ffffff";
        iosArr.push(listElement);
        selectedIDS.push(id);

          if(uFlag==0)
        {
          toggleAdNetworkStatus("core_unity");
        }
      }
      else
      {
        but.style.backgroundColor = "";
        but.style.color = "";
        but.blur();
        iosArr.splice(iosArr.indexOf(listElement), 1);
        selectedIDS.splice(selectedIDS.indexOf(id),1);
      }

      update();
    }
  }

}

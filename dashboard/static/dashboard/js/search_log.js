function getData(page, query) {
    var xmlhttp = Getxmlhttp();
    if(query){
        xmlhttp.open("GET", search_log_api_url + "?page=" + page + "&query=" + query, true);
    }else {
        xmlhttp.open("GET", search_log_api_url + "?page=" + page, true);
    }
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState==4){
            if (xmlhttp.status==200){
                var data = toJson(xmlhttp.responseText);
                var logs = data["logs"];
                createtable(logs);
                createPagebar(data["page"], data["paginator"], query);
            }
        }
    }
}

function createtable(logs) {
    tbody = getId("search_log_table_tbody");
    for(var i = 0; i< logs.length; i++){
        log = logs[i];
        var tr = document.createElement("tr");
        var td_id = document.createElement("td");
        var td_ip = document.createElement("td");
        var td_date = document.createElement("td");
        var td_content = document.createElement("td");
        var td_operater = document.createElement("td");

        var td_btu = document.createElement("button");
        td_btu.innerText = "删除";
        td_btu.className = "btn btn-danger";
        td_btu.value = log["id"];
        td_btu.addEventListener("click", function () {
            deletelog(this.value);
        });

        td_id.innerText = log["id"];
        td_ip.innerText = log["ip"];
        td_date.innerText = log["date"];
        td_content.innerText = log["content"];
        td_operater.appendChild(td_btu);
        tr.appendChild(td_id);
        tr.appendChild(td_ip);
        tr.appendChild(td_content);
        tr.appendChild(td_date);
        tr.appendChild(td_operater);
        tbody.appendChild(tr);
    }
}

function createPagebar(now_page, pages_vaul, query) {
    var ul = getId("page-ul");
    // Previous
    var previous_li = document.createElement("li");
    var previous_a = document.createElement("a");
    if(now_page == 1){
        previous_li.className = "page-item disabled";
    }else {
        previous_li.className = "page-item";
        if(query){
            previous_a.href = search_log_url + "?page=" + (now_page - 1) + "&query=" + query;
        }else {
            previous_a.href = search_log_url + "?page=" + (now_page - 1);
        }
    }
    previous_a.className = "page-link";
    previous_a.innerText = "Previous";
    previous_li.appendChild(previous_a);
    ul.appendChild(previous_li);
    // next
    var next_li = document.createElement("li");
    var next_a = document.createElement("a");
    if(now_page == pages_vaul[pages_vaul.length - 1]){
        next_li.className = "page-item disabled";
    }else {
        next_li.className = "page-item";
        if(query){
            next_a.href = search_log_url + "?page=" + (now_page + 1) + "&query=" + query;
        }else {
            next_a.href = search_log_url + "?page=" + (now_page + 1);
        }
    }
    next_a.className = "page-link";
    next_a.innerText = "Next";
    next_li.appendChild(next_a);

    for(var i = 0; i < pages_vaul.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        if(now_page == pages_vaul[i]){
            li.className = "page-item active";
        }else {
            li.className = "page-item";
        }
        a.className = "page-link";
        if(query){
            a.href = search_log_url + "?page=" + pages_vaul[i] + "&query=" + query;
        }else {
            a.href = search_log_url + "?page=" + pages_vaul[i];;
        }
        a.innerText = pages_vaul[i];
        li.appendChild(a);
        ul.appendChild(li);
    }
    ul.appendChild(next_li);
}

function remoceChilds(node){
    var childs = node.childNodes;
    for (var i=0; i<childs.length; i++){
        node.removeChild(childs[i]);
    }
}

function deletelog(id){
    var xmlhttp = Getxmlhttp();
    xmlhttp.open("GET", search_log_del_url+ "?id=" + id, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState==4){
            if (xmlhttp.status==200){
                window.location.reload()
            }
        }
    };
}

function getJsonFromUrl(url) {
  if(!url) url = location.href;
  var question = url.indexOf("?");
  var hash = url.indexOf("#");
  if(hash==-1 && question==-1) return {};
  if(hash==-1) hash = url.length;
  var query = question==-1 || hash==question+1 ? url.substring(hash) :
  url.substring(question+1,hash);
  var result = {};
  query.split("&").forEach(function(part) {
    if(!part) return;
    part = part.split("+").join(" ");
    var eq = part.indexOf("=");
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
    var from = key.indexOf("[");
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]",from);
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

function search(){
    var conetnt = getId("search_content").value;
    window.location.href = search_log_url + "?page=1&query=" + conetnt;
}
window.onload = function(){
    var data = getJsonFromUrl(window.location.href);
    var query = null;
    var page = 1;
    if("page" in data){
        page = data["page"];
    }
    if("query" in data){
        query = data["query"];
    }
    getData(page, query);
};

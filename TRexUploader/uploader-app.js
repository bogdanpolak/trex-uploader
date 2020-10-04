// ------------------------------------------------------------
// Upload form page
// ------------------------------------------------------------
// Article to read:
// Uploading Images In A Pure JSON API
// https://dotnetcoretutorials.com/2018/07/21/uploading-images-in-a-pure-json-api/

const uploadPageProcesor = {

    urlImport: 'unknown',
    onSucsses: null,
    onFailure: null,

    idDivUploadPage: 'import-page',
    idFileInput: "theFile",
    idFacility: 'theFacilityid',
    idPeriod: 'thePeriod',

    uploadid: '---',

    sendUploadFormData: function (data) {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        const self = this;
        xhr.addEventListener( 'load', function( event ) {
            if (self.onSucsses) self.onSucsses();
        } );
        xhr.addEventListener( 'error', function( event ) {
            if (self.onFailure) self.onFailure();
        } );
        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                const json = JSON.parse(xhr.responseText);
                self.uploadid = json.uploadid;
            }
        });
        xhr.open( 'POST', this.urlImport );
        xhr.send( data );
    },
    onSubmitFormAndWhenFileIsReady: function () {
        const facilitySel = document.getElementById( this.idFacility );
        const periodSel = document.getElementById( this.idPeriod );
        const fileInput = document.getElementById( this.idFileInput );
        // TODO: Migrate XMLHttpRequest => FetchAPI 
        // const form = new FormData(document.getElementById('login-form'));
        // fetch('/login', {method: 'POST', body: form });
        // if (window.fetch) { OK } else { polyfill }
        var data = new FormData();
        data.append('token', '00000-11111-22222');
        data.append(facilitySel.name, facilitySel.value);
        data.append(periodSel.name, periodSel.value);
        data.append('file', fileInput.files[0], fileInput.files[0].name);
        this.sendUploadFormData(data);
    },
    init: function (){
        form.addEventListener( 'submit', function ( event ) {
            event.preventDefault();
            this.onSubmitFormAndWhenFileIsReady();
        } ).bind(this);
    },
    hide: function() {
        const divUploadFormPage = document.getElementById(this.idDivUploadPage);
        divUploadFormPage.style.display = 'none';
    }
}

// ------------------------------------------------------------
// Progress page
// ------------------------------------------------------------

const progressPageProcesor = {

    onSucsses: null,

    fakeProgressAnimTime: 4000,
    idProgressPageDiv: 'progress-page',
    idProgresElement: 'procesProgres',
    progress: 0,
    timerID: null,

    updateProgress: function () {
        this.progress += 1;
        const divProgres = document.getElementById(this.idProgresElement);
        divProgres.style.width = this.progress+'%';
        divProgres.setAttribute("aria-valuenow",this.progress);
    },
    animateProgress: function () {
        let self = this;
        const timerID = setInterval( function(){
            if (self.progress === 100) {
                clearTimeout(timerID);
                if (self.onSucsses) self.onSucsses();
            };
            self.updateProgress();
        }, this.fakeProgressAnimTime/100 );
    },
    show: function () {
        divProgressPage = document.getElementById(this.idProgressPageDiv);
        divProgressPage.style.display = 'block';
        this.animateProgress();
    },
    hide: function () {
        divProgressPage = document.getElementById(this.idProgressPageDiv);
        divProgressPage.style.display = 'none';
    }
}

// ------------------------------------------------------------
// Report page
// ------------------------------------------------------------

function nn(tagName, tagClassName, text) {
    var newNode = document.createElement(tagName);
    if (tagClassName) {
        newNode.classList.add(tagClassName);
    }
    newNode.innerHTML = text
    return newNode;
}

const reportPageProcesor = {

    urlGetResults: '----',
    uploadId: '----', 
    idReportPageDiv: 'report-page',
    cssReportTable: 'report-table',
    urlEditorDownloadLink = 'https://localhost:44373/download/VCL_TRexDataEditor.exe',

    buildReportItems: function(divReportPage,resultData) {
        var divReportTable = document.createElement('div');
        divReportTable.classList.add(this.cssReportTable);
        divReportPage.append(divReportTable);
        resultData.forEach( (item) => {
            divReportTable.append( 
                nn('div',
                    (item.type=='error'?'red':'yellow'),
                    item.message+': <span class="count">'+item.count+'</span>') 
            );
        });
        divReportTable.append( 
            // TODO: Convert nn to recursive and accept array on items
            nn('div','',
                '<div class="alert alert-dark text-center" role="alert">'
                +'<a class="h4" href="'+this.urlEditorDownloadLink+'">Open Data Live Editor</a>'
                +'<div>'+this.uploadId+'</div>'
                +'</div>')
        );

    },
    show: function () {
        const self = this;
        fetch(this.urlGetResults.formatUnicorn(this.uploadId))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var result = data.reduce(function (previous, obj, idx) {
                const j = previous.findIndex((o2)=>(o2.message==obj.message));
                if (j>=0)
                    previous[j].count += 1;
                else
                    previous.push({message:obj.message, type:obj.type, 'count':1});
                return previous;
            }, []);
            self.buildReportItems(divReportPage,result);
        });
        const divReportPage = document.getElementById(this.idReportPageDiv);
        divReportPage.style.display = 'block';
    },
    hide: function () {
        const divReportPage = document.getElementById(this.idReportPageDiv);
        divReportPage.style.display = 'none';
    }
}

// ------------------------------------------------------------
// polyfills and extensions 
// ------------------------------------------------------------

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

// ------------------------------------------------------------

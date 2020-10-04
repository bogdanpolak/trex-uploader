// ------------------------------------------------------------
// Upload form page
// ------------------------------------------------------------

const uploadProcesor = {

    urlImport: 'unknown',
    onSucsses: null,
    onFailure: null,

    idDivUploadPage: 'import-page',
    idFileInput: "theFile",
    idFacility: 'theFacilityid',
    idPeriod: 'thePeriod',

    uploadid: '---',

    fileBinary: null,
    // dataToPost: null,
    // partBoundaryCode: 'hackathon2020',

    /*
    addTextPart: function (name, value) {
        data = "--" + this.partBoundaryCode + "\r\n";
        data += 'content-disposition: form-data; name="' + name + '"\r\n';
        data += '\r\n';
        data += value + "\r\n";
        return data;
    },
    addBinaryPart: function(fileInput){
        let data = "";
        if ( fileInput.files[0] ) {
            data += "--" + this.partBoundaryCode + "\r\n";
            data += 'content-disposition: form-data; '
                    + 'name="'         + fileInput.name          + '"; '
                    + 'filename="'     + fileInput.files[0].name + '"\r\n';
            data += 'Content-Type: ' + fileInput.files[0].type + '\r\n';
            data += '\r\n';
        }
        return data;
    },
    */
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
        /*
        xhr.setRequestHeader( 'Content-Type','multipart/form-data;'
            +' boundary='+ this.partBoundaryCode );
        */
        xhr.send( data );
    },
    onSubmitFormAndWhenFileIsReady: function () {
        const facilitySel = document.getElementById( this.idFacility );
        const periodSel = document.getElementById( this.idPeriod );
        const fileInput = document.getElementById( this.idFileInput );
        /*
        const partToken = this.addTextPart('token', '00000-11111-22222');
        const partFacility = this.addTextPart(facilitySel.name, facilitySel.value);
        const partPeriod = this.addTextPart(periodSel.name, periodSel.value);
        const headerFile = this.addBinaryPart(fileInput)
        this.dataToPost = partToken 
            + partFacility 
            + partPeriod 
            + headerFile 
            + this.fileBinary + '\r\n';
            + "--" + this.partBoundaryCode + "--";
        */
        var data = new FormData();
        data.append('token', '00000-11111-22222');
        data.append('file', fileInput.files[0], fileInput.files[0].name);
        data.append('facilityid', facilitySel.value);
        data.append('period', periodSel.value);
        this.sendUploadFormData(data);
    },
    init: function (){
        const fileInput = document.getElementById(this.idFileInput)
        const reader = new FileReader();
        const self = this;
        reader.addEventListener( "load", function () {
            self.fileBinary = reader.result;
        } );
        // At page load, if a file is already selected, read it.
        if( fileInput.files[0] ) {
            reader.readAsBinaryString( fileInput.files[0] );
        }
        // If not, read the file once the user selects it.
        fileInput.addEventListener( "change", function () {
            if( reader.readyState === FileReader.LOADING ) {
                reader.abort();
            }
            reader.readAsBinaryString( fileInput.files[0] );
        } );
        function sendImportRequest(){
            // wait to load file content
            if( !self.fileBinary && fileInput.files.length > 0 ) {
                setTimeout( sendImportRequest, 30 );
                return;
            }
            self.onSubmitFormAndWhenFileIsReady();
        }
        const form = document.getElementById( "data-upload" );
        form.addEventListener( 'submit', function ( event ) {
            event.preventDefault();
            sendImportRequest();
        } );
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

/*
https://gomakethings.com/how-to-use-the-fetch-api-with-vanilla-js/

fetch('https://jsonplaceholder.typicode.com/posts')
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
		console.log(data);
    });
*/

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
    idReportPageDiv: 'report-page',
    cssReportTable: 'report-table',

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
            nn('div','',
                '<div class="alert alert-dark text-center" role="alert">'
                +'<a class="h4" href="https://localhost:44373/download/VCL_TRexDataEditor.exe">Open Data Live Editor</a>'
                +'<div>'+uploadProcesor.uploadid+'</div>'
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

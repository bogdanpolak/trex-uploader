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
            if(this.readyState === 4) 
                console.log(this.responseText);
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

    fakeProgressAnimTime: 2000,
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
// Progress page
// ------------------------------------------------------------

/* 
var cars = [{ make: 'audi', model: 'r8', year: '2012' }, { make: 'audi', model: 'rs5', year: '2013' }, { make: 'ford', model: 'mustang', year: '2012' }, { make: 'ford', model: 'fusion', year: '2015' }, { make: 'kia', model: 'optima', year: '2012' }]
cars.reduce(function (previous, obj, idx) {
        previous[obj.make] = previous[obj.make] || [];
        previous[obj.make].push(obj);
        return previous;
    }, Object.create(null));
*/

function nn(node, tagName, text) {
    var newNode = document.createElement('div');
    node.append(newNode);

}

const reportPageProcesor = {
    
    idReportPageDiv: 'report-page',

    /*
    buildReportItems: function(divReportPage) {
        var divReportTable = document.createElement('div');
        divReportTable.classList.add("report-table");
        divReportPage.append(divReportTable);
    
        data.forEach( (reportItem, index) => {
            this.insertItem(reportItem)
        });
    },
    */
    show: function () {
        const divReportPage = document.getElementById(this.idReportPageDiv);
        divReportPage.style.display = 'block';
        const data = testReportData;
        // this.buildReportItems(divReportPage);
    },
    hide: function () {
        const divReportPage = document.getElementById(this.idReportPageDiv);
        divReportPage.style.display = 'none';
    }
}

// ------------------------------------------------------------

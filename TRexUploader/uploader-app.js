// ------------------------------------------------------------
// Upload form
// ------------------------------------------------------------

const uploadProcesor = {

    urlImport: 'unknown',
    idFileInput: "theFile",
    idFacility: 'theFacilityid',
    idPeriod: 'thePeriod',

    fileBinary: null,
    dataToPost: null,
    partBoundaryCode: 'hackathon2020',

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
    sendUploadFormData: function (data) {
        const XHR = new XMLHttpRequest();
        XHR.addEventListener( 'load', function( event ) {
            alert( 'Yeah! Data sent and response loaded.' );
        } );
        XHR.addEventListener( 'error', function( event ) {
            alert( 'Oops! Something went wrong.' );
        } );
        XHR.open( 'POST', this.urlImport );
        XHR.setRequestHeader( 'Content-Type','multipart/form-data;'
            +' boundary='+ this.partBoundaryCode );
        XHR.send( this.dataToPost );
    },
    onSubmitFormAndWhenFileIsReady: function () {
        const facilitySel = document.getElementById( this.idFacility );
        const periodSel = document.getElementById( this.idPeriod );
        const fileInput = document.getElementById( this.idFileInput );
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
        this.sendUploadFormData();
    },
    init: function (){
        const fileInput = document.getElementById(uploadProcesor.idFileInput)
        const reader = new FileReader();
        reader.addEventListener( "load", function () {
            uploadProcesor.fileBinary = reader.result;
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
            if( !uploadProcesor.fileBinary && fileInput.files.length > 0 ) {
                setTimeout( sendImportRequest, 30 );
                return;
            }
            uploadProcesor.onSubmitFormAndWhenFileIsReady();
        }
        const form = document.getElementById( "data-upload" );
        form.addEventListener( 'submit', function ( event ) {
            event.preventDefault();
            sendImportRequest();
        } );
    }
}


// ------------------------------------------------------------

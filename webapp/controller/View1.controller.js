sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Icon",
    "sap/m/Link",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    function (Controller, MessageToast, Icon, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("project3.controller.View1", {
            onInit: function () {

                var currentDate = new Date();
                var maxDate = new Date();
                maxDate.setFullYear(currentDate.getFullYear() + 4);

                var oDatePicker = this.byId("datePicker");

                oDatePicker.setMinDate(currentDate);
                oDatePicker.setMaxDate(maxDate);



                var oModel = new sap.ui.model.json.JSONModel({
                    panCardValue: "",
                    gstinValue: "",
                    emailValue: "",
                    numberValue: "",
                    pan: [],
                    gst: []
                });
                this.getView().setModel(oModel);
            },

            onPanCardChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                if (panCardPattern.test(sValue)) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                }
            },
            onGSTINChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sGSTIN = oInput.getValue();

                var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                var sPanCard = this.getView().getModel().getProperty("/panCardValue");

                if (gstinPattern.test(sGSTIN)) {

                    var sGSTINPan = sGSTIN.substring(2, 12);

                    if (sGSTINPan === sPanCard) {
                        oInput.setValueState("Success");
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                    }
                } else {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid GSTIN format. Please enter a valid GSTIN.");
                }
            },

            onSubmitpan: function () {
                var oInput = this.byId("panInput");
                var sValue = oInput.getValue();

                if (oInput.getValueState() === "Success") {
                    MessageToast.show("PAN Card number is valid: " + sValue);
                } else {
                    MessageToast.show("Please enter a valid PAN Card number.");
                }
            },

            onSubmitgst: function () {
                var oGSTINInput = this.byId("gstinInput");
                var sGSTINValue = oGSTINInput.getValue();

                if (oGSTINInput.getValueState() === "Success") {
                    MessageToast.show("GSTIN are valid:" + sGSTINValue);
                } else {
                    MessageToast.show("Please enter a valid GSTIN or Please ensure both PAN and GSTIN are valid and matching.");
                }
            },

            onEmailChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sEmail = oInput.getValue();


                var emailPattern = /^[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;

                if (emailPattern.test(sEmail)) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                }
            },

            onSubmitemail: function () {
                var oEmailInput = this.byId("emailInput");
                var sEmailValue = oEmailInput.getValue();

                if (oEmailInput.getValueState() === "Success") {
                    MessageToast.show("Email is valid: " + sEmailValue);
                } else {
                    MessageToast.show("Please enter a valid email address.");
                }
            },

            onNumberChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sNumber = oInput.getValue();


                var numberPattern = /^[0-9]{10}$/;

                if (numberPattern.test(sNumber)) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                }
            },

            onSubmitnumber: function () {
                var oNumberInput = this.byId("numberInput");
                var sNumberValue = oNumberInput.getValue();

                if (oNumberInput.getValueState() === "Success") {
                    MessageToast.show("Number is valid: " + sNumberValue);
                } else {
                    MessageToast.show("Please enter a valid Mobile number.");
                }
            },

            onDownload: function (oEvent) {
                var oLink = oEvent.getSource();
                var sFileUrl = oLink.getCustomData()[0].getValue();  // Get the file's base64 URL
                var sFileName = oLink.getText();  // Get the file name from the link's text

                // Create a temporary <a> element to trigger the download
                var oAnchor = document.createElement("a");
                oAnchor.href = sFileUrl;  // Set the Data URL as the href
                oAnchor.download = sFileName;  // Set the download attribute with the file name

                // Append the anchor to the body (it needs to be in the DOM for a click event)
                document.body.appendChild(oAnchor);

                // Programmatically trigger the click event to start the download
                oAnchor.click();

                // Remove the anchor from the DOM after the download is triggered
                document.body.removeChild(oAnchor);
            },

            onFileChangepan: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var oFile = oFileUploader.oFileUpload.files[0]; // Get the first file uploaded

                if (oFile) {
                    var sFileName = oFile.name;
                    var oModel = this.getView().getModel();
                    var aFiles = oModel.getProperty("/pan") || [];

                    aFiles.push({
                        fileName: sFileName,
                        fileUrl: URL.createObjectURL(oFile) // Create a temporary URL
                    });

                    oModel.setProperty("/pan", aFiles);

                }
                // Clear the file uploader field
                oFileUploader.setValue("");

                // Reset the value state for pancard file uploader
                this.byId("pancardfileUploader").setValueState("");

            },
        
            onDeleteFilepan: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();  // Get the item from the List
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/pan");

                // Get the index of the item being deleted
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);  // Remove the file from the array

                oModel.setProperty("/pan", aFiles);  // Update the model
                MessageToast.show("File deleted successfully.");
            },
            onFileChangegst: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var oFile = oFileUploader.oFileUpload.files[0]; // Get the first file uploaded

                if (oFile) {
                    var sFileName = oFile.name;
                    var oModel = this.getView().getModel();
                    var aFiles = oModel.getProperty("/gst") || [];

                    aFiles.push({
                        fileName: sFileName,
                        fileUrl: URL.createObjectURL(oFile) // Create a temporary URL
                    });

                    oModel.setProperty("/gst", aFiles);

                }
                // Clear the file uploader field
                oFileUploader.setValue("");

                // Reset the value state for pancard file uploader
                this.byId("gstfileUploader").setValueState("");

            },
            onDeleteFilegst: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();  // Get the item from the List
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/gst");

                // Get the index of the item being deleted
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);  // Remove the file from the array

                oModel.setProperty("/gst", aFiles);  // Update the model
                MessageToast.show("File deleted successfully.");
            },
           
        onFileUploadpan: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oFileUploader.oFileUpload.files[0]; // Get the uploaded file
       
            if (oFile) {
                var sFileName = oFile.name;
                var oReader = new FileReader();
                var that = this;
       
                oReader.onload = function (e) {
                    var sFileUrl = e.target.result;  // Get the file's base64 data URL
       
                    // Add the file info to the model
                    var oModel = that.getView().getModel();
                    var aFiles = oModel.getProperty("/pan");  // Get current documentfiles array
       
                    aFiles.push({
                        fileName: sFileName,
                        fileUrl: sFileUrl
                    });
       
                    // Update the model with the new file
                    oModel.setProperty("/pan", aFiles);
 
                      // Log updated /files data to console
            console.log("Updated /Pan attachment:", oModel.getProperty("/pan"));
       
                    // Show success message
                    MessageToast.show("File " + sFileName + " uploaded successfully.");
 
                    oModel.refresh(true);
                };
       
                oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
            }
            
        },
        formatAttachmentButtonText: function (pan) {
            if (pan && pan.length > 0) {
                return "View Attachments (" + pan.length + ")";
            } else {
                return "View Attachments (0)";
            }
        },
        onFileUploadgst: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oFileUploader.oFileUpload.files[0]; // Get the uploaded file
       
            if (oFile) {
                var sFileName = oFile.name;
                var oReader = new FileReader();
                var that = this;
       
                oReader.onload = function (e) {
                    var sFileUrl = e.target.result;  // Get the file's base64 data URL
       
                    // Add the file info to the model
                    var oModel = that.getView().getModel();
                    var aFiles = oModel.getProperty("/gst");  // Get current documentfiles array
       
                    aFiles.push({
                        fileName: sFileName,
                        fileUrl: sFileUrl
                    });
       
                    // Update the model with the new file
                    oModel.setProperty("/gst", aFiles);
 
                      // Log updated /files data to console
            console.log("Updated /Pan attachment:", oModel.getProperty("/gst"));
       
                    // Show success message
                    MessageToast.show("File " + sFileName + " uploaded successfully.");
 
                    oModel.refresh(true);
                };
       
                oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
            }
            
        },
        formatAttachmentButtonText: function (gst) {
            if (gst && gst.length > 0) {
                return "View Attachments (" + gst.length + ")";
            } else {
                return "View Attachments (0)";
            }
        },
        // formatAttachmentButtonText: function (aDocumentFiles) {
        //     if (aDocumentFiles && aDocumentFiles.length > 0) {
        //         return "View Attachments (" + aDocumentFiles.length + ")";
        //     } else {
        //         return "View Attachments (0)";
        //     }
        // },
       
        onOpenDialogpan: function () {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("project3.view.fragments.uploadfilepan", this);
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
        },
       
        onOpenDialoggst: function () {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("project3.view.fragments.uploadfilegst", this);
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
        },
       
        onCloseDialog: function () {
            this._oDialog.close();
        },
        onCloseDialoggst: function () {
            this._oDialog.close();
        },
 
       
        onFormsubmit: function () {
            // Get the view
            var oView = this.getView();

            // Collect form field values
            var oFormData = {
                validity: oView.byId("datePicker").getDateValue(), // Get DatePicker value
                relatedParty: oView.byId("radioGroup").getSelectedButton().getText(), // Get RadioButton selected text
                supplierSpendType: oView.byId("Id1").getSelectedKey(), // Get Select value for Supplier Spend Type
                natureOfActivity: oView.byId("Id2").getSelectedKey(), // Get Select value for Nature of Activity
                sector: oView.byId("sectorComboBox").getSelectedKeys(), // Get MultiComboBox selected keys (multiple values)
                FunctionandSubfunctionComboBox: oView.byId("FunctionandSubfunctionComboBox").getSelectedKeys(), // Get MultiComboBox selected keys (multiple values)
                panCardNumber: oView.byId("panInput").getValue(), // Get PAN card value
                gstinNumber: oView.byId("gstInput").getValue(), // Get GSTIN value
                supplierFullName: oView.byId("SupplierNameInput").getValue(), // Get Supplier Full Name
                supplierTradeName: oView.byId("SuppliertradeNameInput").getValue(), // Get Supplier Trade Name
                supplierAddress: oView.byId("SupplierAddressInput").getValue(), // Get Supplier Address
                supplierGstAddress: oView.byId("SupplierAddressgstInput").getValue(), // Get Supplier GST Address
                primaryFirstName: oView.byId("PrimaryFirstnameInput").getValue(), // Get Primary Contact First Name
                primaryLastName: oView.byId("PrimaryLastnameInput").getValue(), // Get Primary Contact Last Name
                primaryEmail: oView.byId("emailInput").getValue(), // Get Email value
                primaryPhone: oView.byId("numberInput").getValue() // Get Phone number value
            };

            // Output form data to the console (or process it further)
            console.log(oFormData);

            // Show a success message (or handle the form data as needed)
            MessageToast.show("Form submitted successfully!");

            // You can now send oFormData to your backend, or perform further validation.
        },

        // Additional methods such as validations (onPanCardChange, onGSTINChange, etc.)
    });
});
      

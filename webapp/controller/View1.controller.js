sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Icon",
    "sap/m/Link",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
],
    function (Controller, MessageToast, Icon, JSONModel, Fragment, Dialog, Button, Text) {
        "use strict";

        return Controller.extend("project3.controller.View1", {
            onInit: function () {
                // onReadSupplierSpendType();
                // onReadNatureofActivity();
                // onReadDepartments();
                // onReadSector(); 

                var currentDate = new Date();
                var maxDate = new Date();
                maxDate.setFullYear(currentDate.getFullYear() + 4);

                var oDatePicker = this.byId("datePicker");

                oDatePicker.setMinDate(currentDate);
                oDatePicker.setMaxDate(maxDate);

                var oModel1 = new sap.ui.model.json.JSONModel();
                oModel1.loadData("/model/data.json");
                this.getView().setModel(oModel1, "customerModel");



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

            // onSubmitgst: function () {
            //     var oGSTINInput = this.byId("gstinInput");
            //     var sGSTINValue = oGSTINInput.getValue();

            //     if (oGSTINInput.getValueState() === "Success") {
            //         MessageToast.show("GSTIN are valid:" + sGSTINValue);
            //     } else {
            //         MessageToast.show("Please enter a valid GSTIN or Please ensure both PAN and GSTIN are valid and matching.");
            //     }
            // },
            onSubmitgst: function () {
                // Get the input value from the user
                var sGstinInput = this.byId("gstinInput").getValue().trim();

                // Access the model with customer data
                var oModel = this.getView().getModel("customerModel");
                var oData = oModel.getProperty("/customers");

                // Find customer based on GSTIN
                var oCustomer = oData.find(function (customer) {
                    return customer.GSTIN === sGstinInput;
                });

                if (oCustomer) {
                    // GSTIN found, show details in a dialog
                    var oDialog = new sap.m.Dialog({
                        title: "Customer Details",
                        content: new sap.m.Text({
                            text: "  Name: " + oCustomer.Name + "\n" +
                                "  Address: " + oCustomer.Address + "\n" +
                                "  Contact Number: " + oCustomer.ContactNumber
                        }),
                        beginButton: new sap.m.Button({
                            text: "OK",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                } else {
                    // GSTIN not found, show message toast
                    MessageToast.show("GSTIN not found!");
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

            // onFileChangepan: function (oEvent) {
            //     var oFileUploader = oEvent.getSource();
            //     var oFile = oFileUploader.oFileUpload.files[0]; // Get the first file uploaded

            //     if (oFile) {
            //         var sFileName = oFile.name;
            //         var oModel = this.getView().getModel();
            //         var aFiles = oModel.getProperty("/pan") || [];

            //         aFiles.push({
            //             fileName: sFileName,
            //             fileUrl: URL.createObjectURL(oFile) // Create a temporary URL
            //         });

            //         oModel.setProperty("/pan", aFiles);

            //     }
            //     // Clear the file uploader field
            //     oFileUploader.setValue("");

            //     // Reset the value state for pancard file uploader
            //     this.byId("pancardfileUploader").setValueState("");

            // },

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
            // onFileChangegst: function (oEvent) {
            //     var oFileUploader = oEvent.getSource();
            //     var oFile = oFileUploader.oFileUpload.files[0]; // Get the first file uploaded

            //     if (oFile) {
            //         var sFileName = oFile.name;
            //         var oModel = this.getView().getModel();
            //         var aFiles = oModel.getProperty("/gst") || [];

            //         aFiles.push({
            //             fileName: sFileName,
            //             fileUrl: URL.createObjectURL(oFile) // Create a temporary URL
            //         });

            //         oModel.setProperty("/gst", aFiles);

            //     }
            //     // Clear the file uploader field
            //     oFileUploader.setValue("");

            //     // Reset the value state for pancard file uploader
            //     this.byId("gstfileUploader").setValueState("");

            // },

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
            formatAttachmentButtonTextpan: function (pan) {
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
                        console.log("Updated /Gst attachment:", oModel.getProperty("/gst"));

                        // Show success message
                        MessageToast.show("File " + sFileName + " uploaded successfully.");

                        oModel.refresh(true);
                    };

                    oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
                }

            },
            formatAttachmentButtonTextgst: function (gst) {
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

                    this._oDialog = this.getView().byId("panDialog");

                    if (!this._oDialog) {
                        this._oDialog = sap.ui.xmlfragment("project3.view.fragments.uploadfilepan", this);
                        this.getView().addDependent(this._oDialog);
                    }
                    this._oDialog.open();
                }
            },

            onOpenDialoggst: function () {
                if (!this._oDialog) {

                    this._oDialog = this.getView().byId("gstDialog");

                    if (!this._oDialog) {
                        this._oDialog = sap.ui.xmlfragment("project3.view.fragments.uploadfilegst", this);
                        this.getView().addDependent(this._oDialog);
                    }
                }
                this._oDialog.open();
            },

            onCloseDialogpan: function () {
                // this._oDialog = this.getView().byId("panDialog");
                this._oDialog.close();
            },

            onCloseDialoggst: function () {
                // this._oDialog = this.getView().byId("gstDialog");
                this._oDialog.close();
            },

            onFormsubmit: function () {
                // Get the view
                var oView = this.getView();

                var oModel = this.getView().getModel();

                // Collect form field values
                var oFormData = {
                    validity: oView.byId("datePicker").getDateValue(),
                    relatedParty: oView.byId("radioGroup").getSelectedButton().getText(),
                    supplierSpendType: oView.byId("supplierSpendType").getSelectedKey(),
                    natureOfActivity: oView.byId("NatureofActivity").getSelectedKey(),
                    sector: oView.byId("sectorComboBox").getSelectedKeys(),
                    FunctionandSubfunction: oView.byId("FunctionandSubfunctionComboBox").getSelectedKeys(),
                    panCardNumber: oView.byId("panInput").getValue(),
                    gstinNumber: oView.byId("gstInput").getValue(),
                    supplierFullName: oView.byId("SupplierNameInput").getValue(),
                    supplierTradeName: oView.byId("SuppliertradeNameInput").getValue(),
                    supplierAddress: oView.byId("SupplierAddressInput").getValue(),
                    supplierGstAddress: oView.byId("SupplierAddressgstInput").getValue(),
                    primaryFirstName: oView.byId("PrimaryFirstnameInput").getValue(),
                    primaryLastName: oView.byId("PrimaryLastnameInput").getValue(),
                    primaryEmail: oView.byId("emailInput").getValue(),
                    primaryPhone: oView.byId("numberInput").getValue()
                };

                var oNewEntry = {
                    "DigressionVendorCodeVal": oFormData.validity,
                    "IsRelPartyVCode": oFormData.relatedParty,
                    "SpendType": oFormData.supplierSpendType,
                    "NatureOfActivity": oFormData.natureOfActivity,
                    "Sector": oFormData.sector,
                    "FunAndSubfun": oFormData.FunctionandSubfunction,
                    "PANCardNo": oFormData.panCardNumber,
                    "GSTIN": oFormData.gstinNumber,
                    "SFullName": oFormData.supplierFullName,
                    "STradeNameGST": oFormData.supplierTradeName,
                    "SAddress": oFormData.supplierAddress,
                    "SAddressGST": oFormData.supplierGstAddress,
                    "PriContactFName": oFormData.primaryFirstName,
                    "PriContactLName": oFormData.primaryLastName,
                    "PriContactEmail": oFormData.primaryEmail,
                    "PriContactMNumber": oFormData.primaryPhone
                };

                // Output form data to the console (or process it further)
                console.log(oFormData);
                console.log(oNewEntry);

                // Use the OData create method
                oModel.setUseBatch(false);
                oModel.create("/odata/v4/attachments/supplierReqSrv", oNewEntry, {
                    method: "POST",
                    success: function () {
                        MessageToast.show("Form submitted successfully.");
                    }.bind(this),  // Ensure 'this' refers to the controller instance
                    error: function () {
                        MessageToast.show("Error while submitting the Form.");
                    }
                });


                // Show a success message (or handle the form data as needed)
                MessageToast.show("Form submitted successfully!");

            },
            onReadDepartments: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/departmentsSrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("FunctionandSubfunctionComboBox").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadSector: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/SectorSrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("sectorComboBox").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadNatureofActivity: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/NatureOfActivitySrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("NatureofActivity").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadSupplierSpendType: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/SupplierSpendTypeSrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("supplierSpendType").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onSave: function () {
                // Get the view
                var oView = this.getView();

                var oModel = this.getView().getModel();

                // Collect form field values
                var oFormData = {
                    validity: oView.byId("datePicker").getDateValue(),
                    relatedParty: oView.byId("radioGroup").getSelectedButton().getText(),
                    supplierSpendType: oView.byId("supplierSpendType").getSelectedKey(),
                    natureOfActivity: oView.byId("NatureofActivity").getSelectedKey(),
                    sector: oView.byId("sectorComboBox").getSelectedKeys(),
                    FunctionandSubfunction: oView.byId("FunctionandSubfunctionComboBox").getSelectedKeys(),
                    panCardNumber: oView.byId("panInput").getValue(),
                    gstinNumber: oView.byId("gstinInput").getValue(),
                    supplierFullName: oView.byId("SupplierNameInput").getValue(),
                    supplierTradeName: oView.byId("SuppliertradeNameInput").getValue(),
                    supplierAddress: oView.byId("SupplierAddressInput").getValue(),
                    supplierGstAddress: oView.byId("SupplierAddressgstInput").getValue(),
                    primaryFirstName: oView.byId("PrimaryFirstnameInput").getValue(),
                    primaryLastName: oView.byId("PrimaryLastnameInput").getValue(),
                    primaryEmail: oView.byId("emailInput").getValue(),
                    primaryPhone: oView.byId("numberInput").getValue()
                };

                // Output form data to the console (or process it further)
                console.log(oFormData);


                // Show a success message (or handle the form data as needed)
                MessageToast.show("Form submitted successfully!");

            },


        });
    });


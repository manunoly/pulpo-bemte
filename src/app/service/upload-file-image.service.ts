import { AuthService } from './../servicios/auth.service';
import { environment } from './../../environments/environment.prod';
import { finalize } from 'rxjs/operators';
import { Chooser } from '@ionic-native/chooser/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { UtilService } from './../servicios/util.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileImageService {
  images;
  public imagesSubject$ = new BehaviorSubject(this.images);

  constructor(
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private filePath: FilePath,
    public util: UtilService,
    private auth: AuthService,
    private platform: Platform,
    private chooser: Chooser

  ) { }

  async selectFile() {
    try {
      const file = await this.chooser.getFile('image/*,' +
          'application/msword,' +                                                             // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +        // .docx
          'application/pdf,' +                                                                // .pdf
          'application/vnd.ms-powerpoint,' +                                                  // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +      // .pptx
          'application/vnd.ms-excel,' +                                                       // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'                 // .xlsx
      );
      console.log('el await', file);
      if(file) {
        const formData = new FormData();
        const imgBlob = new Blob([file.data], {
          type: file.mediaType
        });

        formData.append("mimeType", "multipart/form-data");
        formData.append("file", imgBlob, file.name);
        formData.append("filename", file.name);
        console.log('el formdata error', formData);
        return formData;
      } else {
        return;
      }
    } catch (file) {
      console.log('en el error', file);
      //lo trabajo en el error por problemas de integracion nativos entre ionic y el plugin. tiene que existir el name y el fichero sino es un error verdadero
      if (file && file.name) {
        const formData = new FormData();
        const imgBlob = new Blob([file.data], {
          type: file.mediaType
        });
        formData.append("mimeType", "multipart/form-data");
        formData.append("file", imgBlob, file.name);
        formData.append("filename", file.name);

        console.log('el formdata error', formData);
        return formData;
      }
      return;
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleciona la imagen",
      buttons: [
        {
          text: "Cargar desde galeria local",
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Usar Camara",
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancelar",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  takePicture(sourceType: PictureSourceType){

      var options: CameraOptions = {
        quality: 40,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      this.camera.getPicture(options).then(imagePath => {

        console.log('esta es la imagen en bruto takePicture', imagePath)
        if (
          this.platform.is("android") &&
          sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
        ) {
          this.filePath.resolveNativePath(imagePath).then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
            let currentName = imagePath.substring(
              imagePath.lastIndexOf("/") + 1,
              imagePath.lastIndexOf("?")
            );

            let resPath = this.pathForImage(correctPath);

            let newEntry = {
              name: currentName,
              path: resPath + currentName,
              filePath: correctPath + currentName
            };

            console.log('esta es la newEntry platform.is("android', newEntry);
            this.imagesSubject$.next(newEntry);

          });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);

          let resPath = this.pathForImage(correctPath);

          let newEntry = {
            name: currentName,
            path: resPath + currentName,
            filePath: correctPath + currentName
          };

          console.log('esta es la newEntry', newEntry);
          this.imagesSubject$.next(newEntry);

        }
      });
  }


  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }


  getFormDataToUpload(imgEntry?): Promise<any> {

    return new Promise((resolve, reject) => {
      if (!imgEntry) {
        return reject;
      }

      this.file
        .resolveLocalFilesystemUrl(imgEntry.filePath)
        .then(entry => {
          (<FileEntry>entry).file(file => resolve(this.readFile(file)));
        })
        .catch(err => {
          return err = reject;
        });
    });

  }

  readFile(file: any): Promise<FormData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        formData.append("mimeType", "multipart/form-data");
        formData.append("file", imgBlob, file.name);
        formData.append("filename", file.name);
        console.log('el readFile', formData);
        resolve(formData);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }


  async uploadImageData(formData: FormData) {
    console.log('este formulario envio uploadImage', formData.get(null));
    console.log('este formulario envio uploadImage', JSON.stringify(formData));

    const user = await this.auth.getUserData();
    formData.append("user_id", user.user_id);

    this.util.showLoading();
    return this.http
      .post(environment.api_url + "subir-archivo", formData)
      .pipe(
        finalize(() => {
          this.util.dismissLoading();
        })
      )
      .subscribe(
        res => {
          if (res["success"]) {
            this.util.showMessage("Archivo subido exitosamente.");
          } else {
            this.util.showMessage("Error subiendo archivo desde el servidor.");
          }
        },
        error => {
          this.util.showMessage("Error subiendo archivo.");
        }
      );
  }

}

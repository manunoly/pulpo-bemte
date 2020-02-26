import { AuthService } from "./auth.service";
import { UtilService } from "./util.service";
import { Injectable } from "@angular/core";

import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";
import {
  ActionSheetController,
  ToastController,
  Platform,
  LoadingController
} from "@ionic/angular";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { HttpClient } from "@angular/common/http";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Storage } from "@ionic/storage";
import { FilePath } from "@ionic-native/file-path/ngx";

import { finalize } from "rxjs/operators";

import { environment } from "src/environments/environment.prod";
import { BehaviorSubject, Observable } from "rxjs";
import { async } from "@angular/core/testing";

const STORAGE_KEY = "my_images";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  images = [];
  public imagesSubject = new BehaviorSubject(this.images);

  constructor(
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private filePath: FilePath,
    public util: UtilService,
    private platform: Platform,
    private auth: AuthService
  ) {}

  get imagesO(): Observable<any> {
    return this.imagesSubject;
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          this.updateStoredImages(newFileName);
        },
        error => {
          this.presentToast("Error mientras se capturaba el archivo.");
        }
      )
      .catch(error => {
        this.presentToast("Error mientras se capturaba el archivo.");
      });
  }

  async loadStoredImages() {
    const images = await this.storage.get(STORAGE_KEY);

    this.images = [];
    if (images) {
      console.log("tengo imagenes");
      let arr = JSON.parse(images);
      for (let img of arr) {
        let filePath = this.file.dataDirectory + img;
        let resPath = this.pathForImage(filePath);
        this.images.push({ name: img, path: resPath, filePath: filePath });
      }
    }
    this.imagesSubject.next(this.images);
    return this.images;
  }

  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    this.util.showMessage(text);
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 40,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
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
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        this.copyFileToLocalDir(
          correctPath,
          currentName,
          this.createFileName()
        );
      }
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        // este codigo agrega las imagenes al local, por ahora sera solo 1
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry];
      this.imagesSubject.next(this.images);
      // this.images = [newEntry, ...this.images];
      // trigger change detection cycle   this.ref.detectChanges();
    });
  }

  deleteImage(imgEntry, position = 1) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(
        0,
        imgEntry.filePath.lastIndexOf("/") + 1
      );

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        // this.presentToast("Imagen temporal eliminada");
        setTimeout(() => {
          this.loadStoredImages();
        }, 1000);
      });
    });
  }

  async startUpload(imgEntry?) {
    if (!imgEntry) {
      const imgs = await this.loadStoredImages();
      imgEntry = imgs[0];
    }

    return this.file
      .resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file));
      })
      .catch(err => {
        this.presentToast("Error al leer el archivo.");
        return false;
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append("mimeType", "multipart/form-data");
      formData.append("file", imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const user = await this.auth.getUserData();
    formData.append("user_id", user.user_id);
    const loading = await this.loadingController.create({
      message: "Subiendo imagen..."
    });
    await loading.present();

    return this.http
      .post(environment.api_url + "subir-archivo", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(
        res => {
          // alert(JSON.stringify(res));
          if (res["success"]) {
            this.presentToast("Archivo subido exitosamente.");
            setTimeout(async () => {
              const imgs = await this.loadStoredImages();
              if (imgs && imgs.length > 0)
                imgs.forEach(element => {
                  this.deleteImage(element);
                });
            }, 2000);
          } else {
            this.presentToast("Error subiendo archivo.");
          }
        },
        error => {
          this.presentToast("Error subiendo archivo.");
          // setTimeout(() => {
          //   alert(JSON.stringify(error));
          // }, 2000);
          // this.presentToast('error ' + JSON.stringify(error.error));
        }
      );
  }

  async eliminarImagenes() {
    const imgs = await this.loadStoredImages();
    if (imgs && imgs.length > 0)
      imgs.forEach(element => {
        this.deleteImage(element);
      });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecciona imagen",
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
}

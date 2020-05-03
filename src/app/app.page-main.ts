import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './page-main.html',
  styleUrls: ['./page-main.css']
})
export class PageMainComponent {
    // Hard-code credentials for convenience.
    message               = '';
    secureData:string     = '';
    managerData:string    = '';
    reqInfo:any           = null;
    msgFromServer:string  = '';
    _apiService:ApiService;

    bitcoin: number
    // userItemArray: any
    // itemArray: any
    totalPower: number
    audioArray = ['assets/sounds/sfx1.mp3', 'assets/sounds/sfx2.mp3', 'assets/sounds/sfx3.mp3']


    public site='http://localhost:1337/';

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.checkLoggedIn()
        // this.getItems()
        this.getBitcoin()
        this.getUserItemArray()
        this.startAutosave()
    }

    checkLoggedIn() {
        if(sessionStorage.getItem('username') == null){
            this.router.navigate(['page-login'])
        }
    }

    getBitcoin() {
        let url = this.site + 'user/getBitcoin'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                (data) => {
                    this.bitcoin = data
                } )
    }

    async getUserItemArray(){
        let url = this.site + 'user/getItemArray'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                (data) => {
                    console.log(data)
                    let userItemArray = data
                    this.getItems(userItemArray)
                } )

    }

    getItems(userItemArray) {
        let url = this.site + 'Game/getItems'
        this.http.get<any>(url)
            .subscribe(
                (data) => {
                    let array = []
                    for(let i=0;i<data.length;i++){
                        array.push(data[i].power)
                    }
                    this.calculateTotalPower(array, userItemArray)
                } )
    }

    calculateTotalPower(itemArray, userItemArray) {
        this.totalPower = 0
        for(let i=0;i < userItemArray.length;i++){
            this.totalPower += userItemArray[i] * itemArray[i]
        }

    }

    increaseBitcoin() {
        this.bitcoin += 1 + this.totalPower
        let audio = new Audio()
        audio.src = this.audioArray[Math.floor(Math.random() * this.audioArray.length)]
        audio.load();
        audio.play();
    }

    openShop() {
        this.saveProgress()
        this.router.navigate(['page-shop'])
    }

    saveProgress() {
        console.log('Saving Progress..')
        let url = this.site + 'user/saveProgress'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe(
                (data) => {
                    this.message = data
                } )
    }

    //Can someone figure out how to call saveProgress() in setInterval? I cant seem to do it so i just retyped the saveProgress() function lol
    startAutosave() {
        if(sessionStorage.getItem('save') == 'false'){
            sessionStorage.setItem('save', 'true')
            setInterval(() => {
                console.log('Saving Progress..')
                let url = this.site + 'user/saveProgress'
                this.http.post<any>(url, {
                    email: sessionStorage.getItem("email"),
                    bitcoin: this.bitcoin
                })
                    .subscribe(
                        (data) => {
                            console.log(data)
                        } )
            }, 5000)
        } else {
            console.log('Automated saving is already activated.')
        }
    }

}
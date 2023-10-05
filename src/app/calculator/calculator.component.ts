import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
interface PyramidVolume {
  top?:number | null,
  middle?:number |null,
  base?:number | null
}
interface Accords {
  name:string|null,
  type:string | null,
  volume:number | null
}
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  calculateForm: FormGroup = this.fb.group({
    quantity: new FormControl(''),
    topPerc: new FormControl(''),
    middlePerc: new FormControl(''),
    basePerc: new FormControl(''),
    accords: this.fb.array([]),
  });
  pyramid:PyramidVolume = {top:null,middle:null,base:null};
  finalVolume:Accords[] = []
  quantity!: number;
  constructor(private fb: FormBuilder) {}

  calculate() {
    this.quantity = this.calculateForm.value.quantity;
    this.pyramid.top =this.getPyramidVolume(this.quantity,this.calculateForm.value.topPerc);
    this.pyramid.middle = this.getPyramidVolume(this.quantity,this.calculateForm.value.middlePerc);
    this.pyramid.base = this.getPyramidVolume(this.quantity,this.calculateForm.value.basePerc);
    this.finalVolume = this.getFinalVolume(this.calculateForm.value.accords)
    let test  = this.finalVolume.reduce(((acc:any,current:any)=> acc + current.volume),0)
    console.log('final volume',test)
  }

  getPyramidVolume(quantity:any,percentage:any) {
    let volume = quantity *(percentage/100)
    return  parseFloat(volume.toFixed(3));
  }
  getFinalVolume(accords:any){
    debugger
   // accords.reduce((acc:any,current:any)=>{},0)
    let finalVolume:any = [];
    let singleVolume:Accords = {name:null,type:null,volume:null};
    let topAccords = accords.filter((accord:any)=> accord.type == 'top');
    let middleAccords = accords.filter((accord:any)=> accord.type == 'middle');
    let baseAccords = accords.filter((accord:any)=> accord.type == 'base');
    let totalFactorTop:any;
    let totalFactorMiddle:any;
    let totalFactorBase:any;
    totalFactorTop = topAccords.reduce((acc:any, current:any) => acc + parseInt(current.factor) , 0);
    totalFactorMiddle = middleAccords.reduce((acc:any, current:any) => acc + parseInt(current.factor) , 0);
    totalFactorBase = baseAccords.reduce((acc:any, current:any) => acc + parseInt(current.factor) , 0);
    topAccords.forEach((top:any)=>{
    finalVolume.push({ name:top.name,type:top.type,volume:(this.pyramid.top) * (parseFloat(parseInt(top.factor).toFixed(3))/totalFactorTop)})
    })
    middleAccords.forEach((middle:any)=>{
    finalVolume.push({ name:middle.name,type:middle.type,volume:(this.pyramid.top) * (parseFloat(parseInt(middle.factor).toFixed(3))/totalFactorMiddle)})
    })
    baseAccords.forEach((base:any)=>{
    finalVolume.push({ name:base.name,type:base.type,volume:(this.pyramid.top) * (parseFloat(parseInt(base.factor).toFixed(3))/totalFactorBase)})
    })
    console.log(finalVolume)
    return finalVolume;
  }
  //formArray for Accords
  get accords() {
    return this.calculateForm.controls['accords'] as FormArray;
  }
  addAccord() {
    const accord = this.fb.group({
      name: new FormControl(''),
      type: new FormControl(''),
      factor: new FormControl(''),
    });
    this.accords.push(accord);
  }
  deleteAccord(index: number) {
    this.accords.removeAt(index);
  }
}

import {Component, Input} from '@angular/core';
import {Brand} from "../../models/brand";


@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.sass'
})
export class BrandDetailComponent {

  @Input() brand!: Brand

}

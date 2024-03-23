import {Component, OnInit} from '@angular/core';
import {Format} from "../../models/format";
import {FormatService} from "../../services/format.service";

@Component({
  selector: 'app-logo-bar',
  templateUrl: './logo-bar.component.html',
  styleUrl: './logo-bar.component.sass'
})
export class LogoBarComponent implements OnInit {
  formats: Format[] = [];

  constructor(private formatService: FormatService) { }

  ngOnInit(): void {
    this.formatService.getFormats().subscribe(formats => {
      this.formats = formats;
    });
  }
}

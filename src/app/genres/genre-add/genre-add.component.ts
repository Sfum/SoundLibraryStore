import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GenreService} from "../../services/genre.service";
import {Genre} from "../../models/genre";

@Component({
  selector: 'app-genre-add',
  templateUrl: './genre-add.component.html',
  styleUrl: './genre-add.component.sass'
})
export class GenreAddComponent implements OnInit {

  genreForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private genreService: GenreService) {

    this.genreForm = this.formBuilder.group({
      id: ['', Validators.required],
      genre_name: ['', Validators.required],
      genre_description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      const newGenre: Genre = {
        id: this.genreForm.value.id,
        genre_name: this.genreForm.value.genre_name,
        genre_description: this.genreForm.value.genre_description
      };
      this.genreService.addGenre(newGenre)
        .then(() => {
          console.log('Genre added successfully.');
          this.genreForm.reset();
        })
        .catch(error => {
          console.error('Error adding genre: ', error);
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}

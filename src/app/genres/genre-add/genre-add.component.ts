import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../models/genre';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genre-add',
  templateUrl: './genre-add.component.html',
  styleUrl: './genre-add.component.sass',
})
export class GenreAddComponent {
  genreForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private genreService: GenreService,
    private router: Router,
  ) {
    this.genreForm = this.formBuilder.group({
      _id: [''],
      id: ['', Validators.required],
      genre_name: ['', Validators.required],
      genre_description: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      const newGenre: Genre = {
        _id: this.genreForm.value._id,
        id: this.genreForm.value.id,
        genre_name: this.genreForm.value.genre_name,
        genre_description: this.genreForm.value.genre_description,
      };
      this.genreService
        .addGenre(newGenre)
        .then(() => {
          console.log('Genre added successfully.');
          this.genreForm.reset();
          this.router.navigate(['/manage-genres']);
        })
        .catch((error) => {
          console.error('Error adding genre: ', error);
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}

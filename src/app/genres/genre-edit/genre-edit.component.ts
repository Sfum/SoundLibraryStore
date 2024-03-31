import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GenreService} from "../../services/genre.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Genre} from "../../models/genre";

@Component({
  selector: 'app-genre-edit',
  templateUrl: './genre-edit.component.html',
  styleUrl: './genre-edit.component.sass'
})
export class GenreEditComponent implements OnInit {
  genreForm: FormGroup;
  // @ts-ignore
  genreId: string;

  genreEdit$: Observable<Genre[]> | undefined;


  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.genreForm = this.fb.group({

      id: ['', Validators.required],
      genre_name: ['', Validators.required],
      genre_description: ['', Validators.required],

    });
    this.genreEdit$ = this.genreService.getGenres()

  }


  ngOnInit(): void {
    // @ts-ignore
    this.genreId = this.route.snapshot.paramMap.get('id');
    this.loadGenre();
  }


  loadGenre() {
    this.genreService.getGenre(this.genreId).subscribe(
      (genre) => {
        if (genre) {
          const { id, ...genreData } = genre;
          this.genreForm.patchValue(genreData);
        } else {
          console.error('Genre not found');
        }
      },
      (error) => {
        console.error('Error retrieving genre: ', error);
      }
    );
  }

  onSubmit() {
    if (this.genreForm.valid) {
      this.genreService.updateGenre(this.genreId, this.genreForm.value).subscribe(
        () => {
          console.log('Genre updated successfully.');
          // Handle success, maybe redirect to the genre details page
          this.router.navigate(['/provider']);
        },
        (error) => {
          console.error('Error updating genre: ', error);
        }
      );
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}

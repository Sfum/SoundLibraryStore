import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Genre } from '../../models/genre';
import { GenreService } from '../../services/genre.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.sass',
})
export class GenreListComponent implements OnInit {
  displayedColumns: string[] = [
    // '_id',
    // 'id',
    'genre_name',
    'genre_description',
    'delete',
  ];
  // @ts-ignore
  dataSource: MatTableDataSource<Genre>;
  genres: Genre[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private genreService: GenreService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres;
      this.dataSource = new MatTableDataSource<Genre>(this.genres);
      this.dataSource.paginator = this.paginator;
    });
  }
  deleteGenre(id: string) {
    if (confirm('Are you sure you want to delete this genre?')) {
      this.genreService
        .deleteGenre(id)
        .then(() => {
          this.snackbarService.showSnackbar('Genre deleted successfully');
          this.genreService.getGenres().subscribe((genres) => {
            this.genres = genres;
            this.dataSource.data = this.genres;
          });
        })
        .catch((error) => {
          this.snackbarService.showSnackbar('Failed to delete genre');
        });
    }
  }
}

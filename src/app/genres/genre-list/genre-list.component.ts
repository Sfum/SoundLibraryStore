import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Genre} from "../../models/genre";
import {GenreService} from "../../services/genre.service";

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.sass'
})
export class GenreListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'genre_name',
    'genre_description',
  ];
  // @ts-ignore
  dataSource: MatTableDataSource<Genre>;
  genres: Genre[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres;
      this.dataSource = new MatTableDataSource<Genre>(this.genres);
      this.dataSource.paginator = this.paginator;
    });
  }
}

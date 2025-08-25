import { Component , OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {initFlowbite} from 'flowbite';
import { SideNav } from './components/side-nav/side-nav';
import { Header } from "./components/header/header";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideNav, Header, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected title = 'Matrícula';
  ngOnInit() : void {
    initFlowbite();
  }

}

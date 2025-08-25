export interface TipoCurso {
        id ?: number,
        codigo: string,
        nombre: string,
        descripcion: string,
        duracion: number,
        cupoMaximo: number
        
}

export interface TipoAlumno {
        id ?: number,
        idEstudiante: string,
        nombre: string,
        apellido1: string,
        apellido2: string,
        telefono: string,
        correo: string,
        direccion: string,
        fechaIngreso: Date
}

export interface TipoProfesor {
        id ?: number,
        idProfesor: string,
        nombre: string,
        apellido1: string,
        apellido2: string,
        telefono: string,
        correo: string,
        direccion: string,
        fechaIngreso: Date
}

export interface TipoAdministrador {
        id ?: number,
        idAdministrador: string,
        nombre: string,
        apellido1: string,
        apellido2: string,
        telefono: string,
        correo: string,
        direccion: string,
        fechaIngreso: Date
}

export interface TipoGrupo {
        id ?: number,
        idCurso: number,
        idProfesor: string,
        fechaInicio: string,
        fechaFin: string,
        horario: string,
        aula: string
}

export interface TipoEvaluacion {
        id ?: number,
        idMatricula: number,
        nota: number,
        observaciones: string,
        fechaEvaluacion: string
}

export interface TipoMatricula {
        id ?: number,
        idEstudiante: string,
        idGrupo: number,
        fechaMatricula: string,
        estado: string
}

export interface IToken {
        token: string,
        tkRef : string
}
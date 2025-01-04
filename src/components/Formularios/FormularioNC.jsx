
import { Btn,BtnLimpia,ContentBtns,Title,Section,Form } from "../UI";
import Inputs from "../Campos/Inputs";
import TextTarea from "../Campos/Textarea";
import ContentTable from "../Table/Table";
import {v4 as uuidv4} from "uuid";
import { Api } from "../../api/ClienteService.js";
import { useState,useEffect } from "react"
import Loader from "../Loader/Loader";


const FormNuevaCategoria =()=>{
    
    const [titulo,setTitulo]=useState('');
    const [descripcion,setDescripcion]=useState('');
    const [colorPrimario,setColor]=useState('#000000');
    const [codigoS,setCodigoS]=useState('');

    const [categorias,setCategorias]= useState([]);

    const [loading,setLoading]= useState(false);

    useEffect(()=>{
        const ConsultaApi=async()=>{
            const res= await Api.get("categorias");
            if(res.status==200){ 
                setCategorias(res.data)
                setTimeout(()=>{
                    setLoading(true)
                },2500)
            }
        }
        ConsultaApi();
    },[])

    const EnviarDatos=async(e)=>{
        e.preventDefault();
        const data ={
            id:uuidv4(),
            titulo,
            colorPrimario,
            descripcion,
            codigoS
        }
        const post = await Api.post('categorias',data);
        if(post.status==201){
            const res= await Api.get("categorias");
            setCategorias(res.data) 
        }
    }

    const EliminarCategoria = async(id)=>{
        await Api.delete(`categorias/${id}`);
        const {data}= await Api.get("categorias");
        setCategorias(data) 
    }

    const resetText =()=>{
        setTitulo('')
        setDescripcion('')
        setColor('#000000')
        setCodigoS('')
    }


    return(
        <Section>
            <Title>Nueva Categoría</Title>
            <Form onSubmit={EnviarDatos}>
                <Inputs 
                    tipo="text" 
                    titulo="titulo"
                    valor={titulo}
                    ActualizarValor={setTitulo}
                />
                <TextTarea 
                    titulo="Descripcion"
                    ActualizarDescrip={setDescripcion}
                    valor={descripcion}
                />
                <Inputs 
                    tipo="color" 
                    titulo="color"
                    ActualizarValor={setColor}
                    valor={colorPrimario}

                />
                <Inputs 
                    tipo="text" 
                    titulo="Codigo de seguridad"
                    ActualizarValor={setCodigoS}
                    valor={codigoS}
                />

                <ContentBtns>
                    <div>
                        <Btn>Guadar</Btn>
                        <BtnLimpia type="reset" value="Limpiar" onClick={resetText} /> 
                    </div>
                </ContentBtns>
            </Form>
            {loading? <ContentTable Datos={categorias} EliminaDato={EliminarCategoria}  tipo={true} />: <Loader />}
        </Section>
    )
}

export default FormNuevaCategoria


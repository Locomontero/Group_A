<template>
	<v-app id="inspire">
		<v-app-bar
		app
		color="grey"
		dark
		>
		<v-app-bar-nav-icon @click.sotp="mini=!mini"/>
		<v-toolbar-title
		style="width: 300px"
		class="ml-0 pl-4"
		>
		<span class="hidden-sm-and-down"> Painel de Alunos</span>

		</v-toolbar-title>
		<v-spacer/>
		<v-btn icon>
			<v-icon>mdi-logout</v-icon>
		</v-btn>
		</v-app-bar>
		<v-main>
			<v-container
			class="scroll-y"
			fluid
			>
			<v-row
			align="center"
			justify="center"
			>
			<v-col cols="8" md="8">
				<v-card class="ml-5 mr-5">
					<v-app-bar
					dark
					color="#2C3A47"
					>
					<v-btn icon>
						<v-icon>local_offer</v-icon>
					</v-btn>	
					<v-toolbar-title>Alunos</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" persisten max-width="800px">
						<template v-slot:activator="{ on }">
							<v-btn color="red" v-on="on" outlined="">
								<v-icon left>add</v-icon> ADD
							</v-btn>
						</template>
						 <v-card>
						 	<v-form @submit.prevent="savePost" ref="postData" lazy-validation enctype="mnultipart/form-data" autocomplete="off">
						 		<v-card-title>
						 			<span class="headline">Cadastrar Aluno</span>
						 		</v-card-title>
						 		<v-card-text>
						 			<v-container grid-list-md>
						 				<v-layout wrap>
						 					<v-flex xs8 sm8 md8>
						 						<v-text-field label="RA" v-model="postData.ra" color="#2C3A47"></v-text-field>
						 					</v-flex>
						 					<v-flex xs12 sm12 md12>
						 						<v-text-field label="Nome" v-model="postData.name" color="#2C3A47"></v-text-field>
						 					</v-flex>
						 					<v-flex xs12 sm12 md12>
						 						<v-text-field label="Cpf" v-model="postData.cpf" color="#2C3A47"></v-text-field>
						 					</v-flex>
						 					<v-flex xs12 sm12 md12>
						 						<v-text-field label="Email" v-model="postData.email" color="#2C3A47"></v-text-field>
						 					</v-flex>
						 				</v-layout>
						 			</v-container>
						 		</v-card-text>
						 		<v-card-actions>
						 			<v-spacer></v-spacer>
						 			<v-btn color="#2C3A47" dark @click="close" outlined small>
						 				<v-icon left>exit-to-app</v-icon>Fechar
						 			</v-btn>
						 			<v-btn color="light-green darken-4" dark type="submit" outlined small>
						 				<v-icon left>save</v-icon>{{saveDialog}}
						 			</v-btn>
						 		</v-card-actions>
						 	</v-form>
						 </v-card>
					</v-dialog>
					</v-app-bar>
					<v-container>
						<v-card class="mx-auto elevation-19">
							<v-card-title>
								<v-spacer></v-spacer>
								<v-text-field
								v-model="search"
								append-icon="search"
								label="Buscar"
								single-line
								hide-details
								color="#2C3A47"
								>
									
								</v-text-field>
							</v-card-title>
						<v-data-table
						item-key="id"
						:headers="headers"
						:items="posts"
						:search="search"
						>
					<template v-slot:item.actions="{item}">
							<v-btn color="success" class="mx-2" fab x-small @click="editPost(item)" outlined>
								<v-icon samll>mdi-pencil</v-icon>
							</v-btn>
							<v-btn color="pink" fab x-small @click="deletePost(item._id)">
								<v-icon small>mdi-delete</v-icon>
							</v-btn>
					</template>
					<template v-slot:no-results>
						<v-alert :value="true" color="pink" icon="warning" dark>
							Sua procura {{search}} nao existe
						</v-alert>
					</template>
						</v-data-table>
						</v-card>
					</v-container>
				</v-card>
				<v-snackbar
				v-model="snackbar"
				top
				right
				:color="color"
				>
					{{text}}
					<v-btn
					color="black"
					text
					@click="snackbar=false"
					>
					Fermer
					</v-btn>
				</v-snackbar>
			</v-col>
				
			</v-row>
			</v-container>	
		</v-main>
		<v-btn
		v-scroll="onScroll"
		bottom
		color="red"
		dark
		fab
		fixed
		right
		>
		<v-icon>mdi-chevron-up</v-icon>	
		</v-btn>
	</v-app>
</template>

<script>
import axios from 'axios'
export default {
	props:{
		source:String
	},
	data: ()=>({
		mini:false,
		dialog: false,
		fab: false,
		search:'',
		snackbar:false,
		text: '',
		color:'',
		posts:[],
		headers:[
			{text:'RA', value:'ra', sortable:false},
			{text:'Nome', value:'name', sortable:true},
			{text:'Cpf', value:'cpf', sortable:false},
			{text:'Email', value:'email', sortable:false},
			{text:'Action', value:'actions', sortable:false, widht:"180px"},
		],
		postData:{
			ra:'',
			name:'',
			cpf:'',
			email:''
		},
		default:{
			ra:'',
			name:'',
			cpf:'',
			email:''
		},
		editedIndex: -1,
	}),
	watch:{
		dialog (val){
			val || this.close()
		}
	},
	computed:{
		saveDialog(){
		return this.editedIndex === -1 ? 'Save' : 'Edit'
	}
	},
	mounted(){
		this.loadPosts()
	},
	methods: {
	loadPosts: async function(){
		let apiURL ="http://localhost:4000/api"
		axios.get(apiURL).then(res=>{
			this.posts =res.data
		}).catch(error=>{
			console.log(error)
		})
	},
		onScroll(e){
			if(typeof window === 'undefined') return
				const top=window.pageYOffset || e.target.scrollTop || 0
			this.fab =top >20
		},
		toTop(){
			this.$vuetifygoTo(0)
		},
		close(){
			this.dialog=false
			setTimeout(()=>{
				this.postData = Object.assign({}, this.default)
				this.editedIndex = -1
			}, 300)
		},
		savePost: async function(){
			if(this.editedIndex>-1){
				this.updatePost()
			}else{
				this.createPost()
			}
		},
		createPost(){
			let apiURL= 'http://localhost:4000/api/create-post'
			axios.post(apiURL, this.postData).then(()=>{
				this.postData={
					name:'',
					cpf:'',
					email:''
				}
				this.close()
				this.loadPosts()
				this.color = 'success'
				this.text="Aluno criado com sucesso!"
				this.snackbar=true
			}).catch(error=>{
				console.log(error)
			})
		},
		editPost(item){
			this.editedIndex = this.post.indexOf(item)
			this.postData= Object.assign({}, item)
			this.dialog = true
		},
		updatePost(){
			let apiURL ='http://localhost:4000/api/update-post/${this.postData._id}'
			axios.post(apiURL, this.postData).then((res)=>{
				console.log(res)
				this.close()
				this.loadPosts()
				this.color='info'
				this.text='Os dados foram editados com sucesso!'
				this.snackbar=true
			}).catch(error=>{
				console.log(error)
				console.log(this.$route.params.id)
			})
		},
		deletePost(id){
			this.$swal({
				title: 'Tem certeza?',
				text: 'Voce nao podera voltar atras.',
				icon: 'warning',
				showCancelButton:true,
				confirmButtonColor:'#00b894',
				cancelButtonColor: '#d63031',
				confirmButtonText: 'Sim',
				cancelButtonText:'Nao'
			}).then((result)=>{
				if(result.value){
					try{
						let apiURL = 'http://localhost/api/deleted-post/${id}'
						let indexOfArrayItem = this.posts.findIndex(i=>i._id === id)
						axios.delete(apiURL).then(()=>{
							this.posts.splice(indexOfArrayItem, 1)
						}).catch(error =>{
							console.log(error)
						})
						this.$swal(
							'Deletado',
							'Aluno deletado da base de dados',
							'success'
							)
						this.color ='error'
						this.text = 'Aluno deletado da base de dados'
						this.snackbar= true
					}catch(error){
						this.$swal('Failed', 'Alguma coisa esta errado', 'warning')
					}
				}
			})
		}
	},
}
</script>
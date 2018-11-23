<template>
    <div class="account">
    	 <div  class="user_radius" >
		      <div class="balance_div">
		          <h2>
		          	 {{ info.profitAccountBalance }}
		          </h2>
		          <h4>
		          	系统收益账户(元)
		          </h4>
		      </div>
		       <div class="balance_div">
		          <h2>
		          	 {{ info.mainAccountBalance }}
		          </h2>
		          <h4>
		          	系统主账户(元)
		          </h4>
		       </div>
		       <div class="balance_div">
		          <h2>
		          	 {{ info.glodAccountBalance }}
		          </h2>
		          <h4>
		          	系统备付金账户(元)
		          </h4>
		       </div>
		  </div>
    </div>
</template>
<style type="text/css">
.user_radius{
	 width:1100px;
	 height: auto;
	 border:1px solid #BFCBD9;
	 border-radius: 15px;
	 text-align: center;
	 margin:20px 0 30px 0;
	 padding: 20px 30px;
	 font-size: 16px;
	 font-weight: bold;
	 display: inline-block;
}
.balance_div{
	display:inline-block;
	width: 30%;
	text-align: center
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                info: {
                   mainAccountBalance:0,
                   profitAccountBalance:0,
                   glodAccountBalance:0
                }
            }
        },
        created(){
            this.fetchData();
        },
        methods: {

            fetchData () {
                this.dataApi.ajax('accountBalance',null, res => {
                    if (res.responseType === 'S') {
                           this.info=res
                    }
                });

            }

        }
    }
</script>
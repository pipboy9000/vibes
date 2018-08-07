<template>
    <div class="wrapper">
        <div class="bg">
            <div class="titleWrapper">
                <div class="titleBg"></div>
                <div class="titleStroke">helllo</div>
                <div class="title">helllo</div>
            </div>
            <div class="pictures">
                
            </div>
            <div class="info">
                <div class="details">
                    <div class="createdBy">
                        Created by: Dan Levin
                    </div>
                    </br>
                    <div class="users">
                        <img src="../assets/users_icon.png">
                        <p> 9 - 30 minutes ago.</p>
                    </div>
                </div>
                <div class="emojis">
                    <div class="emoji">🤩</div>
                    <div class="emoji">🤩</div>
                    <div class="emoji">🤩</div>
                </div>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
export default {
  name: "VibeDetails",
  props: ["vibe"]
};
</script>

<style scoped="true">
.wrapper {
  position: absolute;
  height: 100%;
}

.bg {
  height: 100%;
  width: 480px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.titleWrapper {
  height: 110px;
  padding-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

.titleBg {
  background: #d5effd;
  height: 55px;
  width: 95%;
  border-radius: 0 8px 8px 0;
}

.title {
  margin-left: 20px;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
}

.titleStroke {
  margin-left: 20px;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
}

.info {
  height: 75px;
  display: flex;
  align-items: center;
  padding: 5px;
  height: fit-content;
}

.details {
  height: 100%;
  width: 50%;
  display: inline-block;
  font-family: "ABeeZee", sans-serif;
  color: #b3b3b3;
  font-size: 16px;
  text-align: left;
  padding-left: 5px;
  font-style: italic;
  height: fit-content;
}

.createdBy {
  display: inline-block;
  margin-bottom: 10px;
}

.users {
  display: inline-flex;
  align-items: center;
  white-space: pre;
  margin-left: 15px;
  height: fit-content;
}

.emojis {
  height: 100%;
  width: 50%;
  display: inline-flex;
  justify-content: center;
}

.emoji {
  margin-left: 5px;
  margin-right: 5px;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #e4e4e410, #e4e4e4, #e4e4e410);
  width: 95%;
}
</style>

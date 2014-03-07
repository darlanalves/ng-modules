# ng Micro-modules

Coleção de módulos reusáveis para AngularJS.

## [maxChars](https://raw.github.com/darlanalves/ng-modules/master/maxChars.js)

Exibe um span "xx / yy" depois de um input/textarea, com o tamanho atual e o restante de caracteres do campo.
Usa o atributo ng-maxlength como nome de diretiva, já ativando a validação do AngularJS para o campo.

```html
<input ng-model="username" ng-maxlength="60" />
```
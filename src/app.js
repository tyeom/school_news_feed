// web application fw
import express from 'express';
// gzip 데이터 압축
import compression from 'compression';
// XSS, HSTS (https 프로토콜 지원시 리다이렉션 처리)
import helmet from 'helmet';
import passport from '~/config/passport';
import routes from '~/routes';
import error from '~/middlewares/error';
import config from '~/config/config';

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger options
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "학교 뉴스피드 (School News feed)",
        version: "0.1.0",
        description:
          "이 문서는 학교 뉴스피드 백앤드 Restful API 문서 입니다.<br/>This document is the school newsfeed backend Restful API document.",
        // license: {
        //   name: "MIT",
        //   url: "https://spdx.org/licenses/MIT.html",
        // },
        // contact: {
        //   name: "tyeom",
        //   url: "https://arong.info",
        //   email: "r.Until@email.com",
        // },
      },
      servers: [
        {
          url: "http://localhost:777/api",
        },
      ],
    },
    apis: ["src/**/*.js"],
};

// Swagger
const specs = swaggerJsdoc(options);

const app = express();

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/api', routes);
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

export default app;
